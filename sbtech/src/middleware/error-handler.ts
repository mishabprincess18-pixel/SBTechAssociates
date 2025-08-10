import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Error logging function
const logBackendError = (error: any, request?: NextRequest) => {
  const errorLog = {
    message: error.message || 'Unknown error',
    stack: error.stack,
    url: request?.url || '',
    method: request?.method || '',
    timestamp: Date.now(),
    type: 'backend' as const,
    userAgent: request?.headers.get('user-agent') || '',
    ip: request?.ip || request?.headers.get('x-forwarded-for') || 'unknown',
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Backend Error:', errorLog);
  }

  // Log to file system for persistence
  const fs = require('fs');
  const path = require('path');
  const logDir = path.join(process.cwd(), 'logs');
  const logFile = path.join(logDir, 'backend-errors.log');

  // Ensure logs directory exists
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  // Append error to log file
  fs.appendFileSync(logFile, JSON.stringify(errorLog) + '\n');
};

// Global error handler for uncaught exceptions
process.on('uncaughtException', (error) => {
  logBackendError(error);
  
  // In production, you might want to gracefully shutdown
  if (process.env.NODE_ENV === 'production') {
    console.error('Uncaught Exception:', error);
    process.exit(1);
  }
});

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  const error = reason instanceof Error ? reason : new Error(String(reason));
  logBackendError(error);
  
  // In production, you might want to gracefully shutdown
  if (process.env.NODE_ENV === 'production') {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  }
});

// Express-style error handling middleware for Next.js API routes
export function withErrorHandler(handler: Function) {
  return async (request: NextRequest, context: any) => {
    try {
      return await handler(request, context);
    } catch (error) {
      logBackendError(error, request);
      
      // Return a safe error response
      return NextResponse.json(
        {
          success: false,
          error: process.env.NODE_ENV === 'development' 
            ? error.message 
            : 'Internal Server Error. Please try again later.',
        },
        { status: 500 }
      );
    }
  };
}

// Validation error handler
export function handleValidationError(error: z.ZodError) {
  const validationErrors = error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
  }));

  return NextResponse.json(
    {
      success: false,
      error: 'Validation failed',
      details: validationErrors,
    },
    { status: 400 }
  );
}

// Rate limiting error handler
export function handleRateLimitError() {
  return NextResponse.json(
    {
      success: false,
      error: 'Too many requests. Please try again later.',
    },
    { status: 429 }
  );
}

// Safe JSON response wrapper
export function safeJsonResponse(data: any, status: number = 200) {
  try {
    return NextResponse.json(data, { status });
  } catch (error) {
    logBackendError(error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error. Please try again later.',
      },
      { status: 500 }
    );
  }
}