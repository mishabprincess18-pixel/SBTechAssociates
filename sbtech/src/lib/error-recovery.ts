// Error recovery and retry utilities

interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoff?: boolean;
  onRetry?: (attempt: number, error: Error) => void;
}

// Retry function with exponential backoff
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = true,
    onRetry
  } = options;

  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts) {
        throw lastError;
      }

      if (onRetry) {
        onRetry(attempt, lastError);
      }

      // Calculate delay with exponential backoff
      const currentDelay = backoff ? delay * Math.pow(2, attempt - 1) : delay;
      await new Promise(resolve => setTimeout(resolve, currentDelay));
    }
  }

  throw lastError!;
}

// Cache for fallback data
const fallbackCache = new Map<string, any>();

// Fetch with fallback to cached data
export async function fetchWithFallback<T>(
  url: string,
  options: RequestInit = {},
  fallbackKey?: string
): Promise<T> {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Cache successful responses
    if (fallbackKey) {
      fallbackCache.set(fallbackKey, data);
    }
    
    return data;
  } catch (error) {
    // Try to use cached data as fallback
    if (fallbackKey && fallbackCache.has(fallbackKey)) {
      console.warn(`Using cached data for ${url} due to error:`, error);
      return fallbackCache.get(fallbackKey);
    }
    
    throw error;
  }
}

// Safe JSON parsing with fallback
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.warn('Failed to parse JSON, using fallback:', error);
    return fallback;
  }
}

// Debounced error reporting to prevent spam
const errorReportQueue = new Map<string, number>();
const ERROR_REPORT_DEBOUNCE = 5000; // 5 seconds

export function debouncedErrorReport(
  errorKey: string,
  reportFn: () => void
): void {
  const now = Date.now();
  const lastReport = errorReportQueue.get(errorKey);
  
  if (!lastReport || now - lastReport > ERROR_REPORT_DEBOUNCE) {
    errorReportQueue.set(errorKey, now);
    reportFn();
  }
}

// Circuit breaker pattern for API calls
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  
  constructor(
    private failureThreshold = 5,
    private resetTimeout = 60000 // 1 minute
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }

  getState(): string {
    return this.state;
  }
}

// Global circuit breaker instances
const circuitBreakers = new Map<string, CircuitBreaker>();

export function getCircuitBreaker(key: string): CircuitBreaker {
  if (!circuitBreakers.has(key)) {
    circuitBreakers.set(key, new CircuitBreaker());
  }
  return circuitBreakers.get(key)!;
}

// Safe async operation wrapper
export async function safeAsync<T>(
  operation: () => Promise<T>,
  fallback: T,
  errorMessage = 'Operation failed'
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error(errorMessage, error);
    return fallback;
  }
}

// Error classification for better handling
export function classifyError(error: Error): 'network' | 'validation' | 'server' | 'unknown' {
  const message = error.message.toLowerCase();
  
  if (message.includes('fetch') || message.includes('network') || message.includes('timeout')) {
    return 'network';
  }
  
  if (message.includes('validation') || message.includes('invalid')) {
    return 'validation';
  }
  
  if (message.includes('500') || message.includes('server')) {
    return 'server';
  }
  
  return 'unknown';
}

// Get user-friendly error message based on error type
export function getUserFriendlyMessage(error: Error): string {
  const type = classifyError(error);
  
  switch (type) {
    case 'network':
      return 'Connection failed. Please check your internet connection and try again.';
    case 'validation':
      return 'Invalid input. Please check your data and try again.';
    case 'server':
      return 'Server error. Please try again later.';
    default:
      return 'Something went wrong. Please try again.';
  }
}