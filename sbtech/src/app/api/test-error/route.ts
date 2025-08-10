import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/middleware/error-handler';

const testErrorHandler = withErrorHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  switch (type) {
    case 'runtime':
      throw new Error('This is a test runtime error');
    
    case 'validation':
      throw new Error('Validation error: Invalid input data');
    
    case 'database':
      throw new Error('Database connection failed');
    
    case 'async':
      // Simulate async error
      await new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Async operation failed')), 100);
      });
      return NextResponse.json({ success: true });
    
    case 'promise':
      // Simulate unhandled promise rejection
      Promise.reject(new Error('Unhandled promise rejection'));
      return NextResponse.json({ success: true });
    
    case 'memory':
      // Simulate memory error
      const arr = [];
      while (true) {
        arr.push(new Array(1000000));
      }
    
    default:
      return NextResponse.json({
        success: true,
        message: 'Error test endpoint',
        availableTypes: ['runtime', 'validation', 'database', 'async', 'promise', 'memory'],
        usage: '/api/test-error?type=runtime'
      });
  }
});

export { testErrorHandler as GET, testErrorHandler as POST };