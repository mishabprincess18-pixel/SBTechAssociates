# Error Handling System Documentation

## Overview

This project implements a comprehensive full-stack error detection, logging, and recovery system that provides:

- **Automatic error capture** for both frontend and backend
- **Real-time error logging** with detailed context
- **User-friendly error messages** with graceful degradation
- **Error recovery mechanisms** with retry logic and fallbacks
- **Development tools** for testing and monitoring errors

## Architecture

### Frontend Error Handling

#### 1. Global Error Listeners
- `window.onerror` - Captures runtime JavaScript errors
- `window.onunhandledrejection` - Captures unhandled promise rejections
- React Error Boundary - Catches React component errors

#### 2. Error Provider (`src/providers/error-provider.tsx`)
- Manages error state and user notifications
- Sends error reports to backend API
- Displays non-blocking toast notifications
- Collects browser and OS information

#### 3. Error Boundary (`src/components/error-boundary.tsx`)
- Catches React component errors
- Provides fallback UI
- Allows error recovery with retry functionality
- Shows detailed error information in development

### Backend Error Handling

#### 1. Global Process Handlers
- `process.on('uncaughtException')` - Catches unhandled exceptions
- `process.on('unhandledRejection')` - Catches unhandled promise rejections

#### 2. API Error Middleware (`src/middleware/error-handler.ts`)
- Wraps API route handlers with error catching
- Provides safe error responses
- Logs errors to file system
- Includes validation and rate limiting error handlers

#### 3. Error Logging API (`src/app/api/error-logs/route.ts`)
- Receives error reports from frontend
- Validates error data with Zod schema
- Implements rate limiting to prevent spam
- Stores errors in persistent log files

## Features

### Error Collection
- **Message and stack trace** capture
- **Page URL and line numbers** for frontend errors
- **Browser and OS information** detection
- **Request details** for backend errors
- **Timestamp** and user agent information

### Error Logging
- **File-based logging** for persistence
- **Console logging** in development mode
- **Rate limiting** to prevent spam
- **Data validation** to ensure log quality

### Error Recovery
- **Retry mechanisms** with exponential backoff
- **Circuit breaker pattern** for API calls
- **Fallback data** from cache
- **Graceful degradation** for failed operations

### User Experience
- **Non-blocking error notifications** via toast messages
- **User-friendly error messages** based on error type
- **Error recovery options** with retry buttons
- **Development-only error details** for debugging

## Usage

### Frontend Error Handling

```typescript
import { useError } from '@/providers/error-provider';

function MyComponent() {
  const { showError } = useError();

  const handleRiskyOperation = async () => {
    try {
      await someRiskyOperation();
    } catch (error) {
      showError('Operation failed. Please try again.');
    }
  };
}
```

### Backend Error Handling

```typescript
import { withErrorHandler } from '@/middleware/error-handler';

const handler = withErrorHandler(async (request: NextRequest) => {
  // Your API logic here
  // Errors will be automatically caught and logged
  return NextResponse.json({ success: true });
});

export { handler as GET };
```

### Error Recovery Utilities

```typescript
import { retry, fetchWithFallback, safeAsync } from '@/lib/error-recovery';

// Retry with exponential backoff
const result = await retry(
  () => fetch('/api/data'),
  { maxAttempts: 3, delay: 1000 }
);

// Fetch with fallback to cached data
const data = await fetchWithFallback('/api/data', {}, 'data-cache-key');

// Safe async operation
const result = await safeAsync(
  () => riskyOperation(),
  fallbackValue,
  'Operation failed'
);
```

## Testing

### Test API Endpoints

Visit `/api/test-error?type=<error-type>` to trigger different types of errors:

- `runtime` - Runtime JavaScript error
- `validation` - Validation error
- `database` - Database connection error
- `async` - Async operation error
- `promise` - Unhandled promise rejection
- `memory` - Memory error (use with caution)

### Frontend Test Panel

In development mode, a test panel appears at the bottom-left of the screen with buttons to trigger different types of frontend errors.

### Error Dashboard

In development mode, an error dashboard appears at the top-left showing:
- Error statistics (frontend/backend/today/this week)
- Recent error logs
- Error details and context

## Configuration

### Environment Variables

```env
NEXTAUTH_URL=http://localhost:3004
NEXTAUTH_SECRET=dev_secret
NEXT_PUBLIC_SITE_URL=http://localhost:3004
```

### Log Files

Error logs are stored in the `logs/` directory:
- `frontend-errors.log` - Frontend error reports
- `backend-errors.log` - Backend error logs

## Production Considerations

### Error Monitoring Service
For production, consider integrating with error monitoring services like:
- Sentry
- LogRocket
- Bugsnag
- Rollbar

### Database Storage
Replace file-based logging with database storage for better scalability and querying capabilities.

### Rate Limiting
Implement more sophisticated rate limiting using Redis or similar services.

### Error Aggregation
Group similar errors to reduce noise and identify patterns.

### Alerting
Set up alerts for critical errors or error rate spikes.

## Security

### Data Sanitization
- Error messages are sanitized before logging
- Sensitive data (passwords, tokens) is excluded
- User input is validated with Zod schemas

### Rate Limiting
- Prevents error log spam
- Configurable limits per IP address
- Automatic cleanup of old rate limit records

### Error Exposure
- Detailed error information only shown in development
- Production errors return generic messages
- Stack traces are logged but not exposed to users

## Monitoring and Maintenance

### Log Rotation
Implement log rotation to prevent log files from growing too large.

### Error Analysis
Regularly analyze error logs to:
- Identify common error patterns
- Fix recurring issues
- Improve error handling

### Performance Impact
Monitor the performance impact of error handling:
- Error reporting should be non-blocking
- Log file I/O should be asynchronous
- Rate limiting should be efficient

## Troubleshooting

### Common Issues

1. **Errors not being logged**
   - Check if the `/api/error-logs` endpoint is accessible
   - Verify environment variables are set correctly
   - Check browser console for network errors

2. **Rate limiting too aggressive**
   - Adjust rate limit settings in the error logs API
   - Check if multiple requests are being made simultaneously

3. **Error dashboard not showing**
   - Ensure `NODE_ENV` is set to 'development'
   - Check if the component is properly imported

4. **Log files not being created**
   - Verify write permissions in the project directory
   - Check if the `logs/` directory exists

### Debug Mode

Enable additional debugging by setting:
```env
DEBUG_ERRORS=true
```

This will log additional information about error handling operations.