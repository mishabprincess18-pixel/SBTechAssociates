import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Error log schema validation
const ErrorLogSchema = z.object({
  message: z.string().max(1000),
  stack: z.string().optional(),
  url: z.string().url(),
  lineNumber: z.number().optional(),
  columnNumber: z.number().optional(),
  browser: z.string().optional(),
  os: z.string().optional(),
  timestamp: z.number(),
  type: z.enum(['error', 'unhandledrejection']),
  userAgent: z.string().optional(),
});

// Rate limiting function
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10; // Max 10 error logs per minute per IP

  const record = rateLimitStore.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

// Clean up old rate limit records
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes

export async function POST(request: NextRequest) {
  try {
    // Get client IP
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = ErrorLogSchema.parse(body);

    // Log the error (in production, save to database)
    const errorLog = {
      ...validatedData,
      ip,
      serverTimestamp: Date.now(),
    };

    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.error('Frontend Error Log:', errorLog);
    }

    // In production, you would save to database here
    // await saveErrorToDatabase(errorLog);

    // Also log to file system for persistence
    const fs = require('fs');
    const path = require('path');
    const logDir = path.join(process.cwd(), 'logs');
    const logFile = path.join(logDir, 'frontend-errors.log');

    // Ensure logs directory exists
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    // Append error to log file
    fs.appendFileSync(logFile, JSON.stringify(errorLog) + '\n');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing error log:', error);
    
    return NextResponse.json(
      { success: false, error: 'Invalid error log format' },
      { status: 400 }
    );
  }
}