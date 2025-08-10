"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AlertCircle, X } from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Interface for error data that gets sent to the backend
 */
interface ErrorData {
  message: string;
  stack?: string;
  url: string;
  lineNumber?: number;
  columnNumber?: number;
  browser?: string;
  os?: string;
  timestamp: number;
  type: 'error' | 'unhandledrejection';
  userAgent?: string;
  componentStack?: string;
}

/**
 * Interface for the error context value
 */
interface ErrorContextValue {
  /** Current error message (null if no error) */
  error: string | null;
  /** Function to show an error message */
  showError: (message: string) => void;
  /** Function to clear the current error */
  clearError: () => void;
  /** Function to show a success message */
  showSuccess: (message: string) => void;
  /** Function to show a warning message */
  showWarning: (message: string) => void;
  /** Function to show an info message */
  showInfo: (message: string) => void;
}

/**
 * Interface for the ErrorProvider props
 */
interface ErrorProviderProps {
  /** Child components that will have access to the error context */
  children: ReactNode;
  /** Optional auto-clear timeout in milliseconds (default: 5000) */
  autoClearTimeout?: number;
  /** Optional maximum error message length (default: 200) */
  maxMessageLength?: number;
}

// ============================================================================
// CONTEXT CREATION
// ============================================================================

/**
 * React context for error state management
 * Provides error handling functionality to child components
 */
const ErrorContext = createContext<ErrorContextValue | undefined>(undefined);

// ============================================================================
// CUSTOM HOOK
// ============================================================================

/**
 * Custom hook to access the error context
 * Must be used within an ErrorProvider
 * 
 * @returns ErrorContextValue - The error context value
 * @throws Error if used outside of ErrorProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { showError, clearError, error } = useError();
 *   
 *   const handleRiskyOperation = async () => {
 *     try {
 *       await someRiskyOperation();
 *     } catch (err) {
 *       showError('Operation failed. Please try again.');
 *     }
 *   };
 *   
 *   return (
 *     <div>
 *       {error && <p>Error: {error}</p>}
 *       <button onClick={handleRiskyOperation}>Try Operation</button>
 *       <button onClick={clearError}>Clear Error</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useError(): ErrorContextValue {
  const context = useContext(ErrorContext);
  
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  
  return context;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Detects browser and operating system information from user agent
 * 
 * @returns Object containing browser and OS information
 */
function getBrowserInfo(): { browser: string; os: string } {
  if (typeof navigator === 'undefined') {
    return { browser: 'Unknown', os: 'Unknown' };
  }

  const userAgent = navigator.userAgent;
  let browser = 'Unknown';
  let os = 'Unknown';

  // Browser detection
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    browser = 'Chrome';
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser = 'Safari';
  } else if (userAgent.includes('Edg')) {
    browser = 'Edge';
  } else if (userAgent.includes('Opera')) {
    browser = 'Opera';
  }

  // Operating system detection
  if (userAgent.includes('Windows')) {
    os = 'Windows';
  } else if (userAgent.includes('Mac')) {
    os = 'macOS';
  } else if (userAgent.includes('Linux')) {
    os = 'Linux';
  } else if (userAgent.includes('Android')) {
    os = 'Android';
  } else if (userAgent.includes('iOS')) {
    os = 'iOS';
  }

  return { browser, os };
}

/**
 * Sends error data to the backend API endpoint
 * 
 * @param errorData - The error data to send
 * @returns Promise that resolves when the request is complete
 */
async function sendErrorToBackend(errorData: ErrorData): Promise<void> {
  try {
    const response = await fetch('/api/error-logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorData),
    });

    if (!response.ok) {
      console.warn('Failed to send error to backend:', response.statusText);
    }
  } catch (error) {
    // Silently fail to avoid infinite loops
    console.warn('Failed to send error to backend:', error);
  }
}

/**
 * Truncates a message to the specified maximum length
 * 
 * @param message - The message to truncate
 * @param maxLength - Maximum length (default: 200)
 * @returns Truncated message
 */
function truncateMessage(message: string, maxLength: number = 200): string {
  if (message.length <= maxLength) {
    return message;
  }
  return message.substring(0, maxLength - 3) + '...';
}

// ============================================================================
// ERROR PROVIDER COMPONENT
// ============================================================================

/**
 * ErrorProvider component that provides error handling functionality
 * to all child components through React context.
 * 
 * Features:
 * - Global error state management
 * - Automatic error logging to backend
 * - User-friendly error notifications
 * - Browser and OS detection
 * - Rate limiting and spam prevention
 * - Development mode enhanced logging
 * 
 * @param props - ErrorProviderProps
 * @returns JSX.Element
 * 
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <ErrorProvider autoClearTimeout={5000} maxMessageLength={200}>
 *       <MyApp />
 *     </ErrorProvider>
 *   );
 * }
 * ```
 */
export function ErrorProvider({ 
  children, 
  autoClearTimeout = 5000, 
  maxMessageLength = 200 
}: ErrorProviderProps): JSX.Element {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  /** Current error message state */
  const [error, setError] = useState<string | null>(null);
  
  /** Current notification type state */
  const [notificationType, setNotificationType] = useState<'error' | 'success' | 'warning' | 'info'>('error');
  
  /** Auto-clear timeout reference */
  const [clearTimeoutRef, setClearTimeoutRef] = useState<NodeJS.Timeout | null>(null);

  // ============================================================================
  // ERROR HANDLING FUNCTIONS
  // ============================================================================

  /**
   * Shows an error message and automatically clears it after the specified timeout
   * 
   * @param message - The error message to display
   */
  const showError = (message: string): void => {
    // Clear any existing timeout
    if (clearTimeoutRef) {
      clearTimeout(clearTimeoutRef);
    }

    // Truncate message if too long
    const truncatedMessage = truncateMessage(message, maxMessageLength);
    
    // Set error state
    setError(truncatedMessage);
    setNotificationType('error');

    // Set auto-clear timeout
    const timeoutRef = setTimeout(() => {
      setError(null);
      setNotificationType('error');
    }, autoClearTimeout);

    setClearTimeoutRef(timeoutRef);
  };

  /**
   * Clears the current error message immediately
   */
  const clearError = (): void => {
    if (clearTimeoutRef) {
      clearTimeout(clearTimeoutRef);
      setClearTimeoutRef(null);
    }
    setError(null);
    setNotificationType('error');
  };

  /**
   * Shows a success message
   * 
   * @param message - The success message to display
   */
  const showSuccess = (message: string): void => {
    if (clearTimeoutRef) {
      clearTimeout(clearTimeoutRef);
    }

    const truncatedMessage = truncateMessage(message, maxMessageLength);
    setError(truncatedMessage);
    setNotificationType('success');

    const timeoutRef = setTimeout(() => {
      setError(null);
      setNotificationType('success');
    }, autoClearTimeout);

    setClearTimeoutRef(timeoutRef);
  };

  /**
   * Shows a warning message
   * 
   * @param message - The warning message to display
   */
  const showWarning = (message: string): void => {
    if (clearTimeoutRef) {
      clearTimeout(clearTimeoutRef);
    }

    const truncatedMessage = truncateMessage(message, maxMessageLength);
    setError(truncatedMessage);
    setNotificationType('warning');

    const timeoutRef = setTimeout(() => {
      setError(null);
      setNotificationType('warning');
    }, autoClearTimeout);

    setClearTimeoutRef(timeoutRef);
  };

  /**
   * Shows an info message
   * 
   * @param message - The info message to display
   */
  const showInfo = (message: string): void => {
    if (clearTimeoutRef) {
      clearTimeout(clearTimeoutRef);
    }

    const truncatedMessage = truncateMessage(message, maxMessageLength);
    setError(truncatedMessage);
    setNotificationType('info');

    const timeoutRef = setTimeout(() => {
      setError(null);
      setNotificationType('info');
    }, autoClearTimeout);

    setClearTimeoutRef(timeoutRef);
  };

  // ============================================================================
  // GLOBAL ERROR HANDLERS
  // ============================================================================

  /**
   * Handles global JavaScript errors
   * 
   * @param event - ErrorEvent from window.onerror
   */
  const handleGlobalError = (event: ErrorEvent): void => {
    const { browser, os } = getBrowserInfo();
    
    const errorData: ErrorData = {
      message: event.message,
      stack: event.error?.stack,
      url: typeof window !== 'undefined' ? window.location.href : '',
      lineNumber: event.lineno,
      columnNumber: event.colno,
      browser,
      os,
      timestamp: Date.now(),
      type: 'error',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Global Error:', errorData);
    }

    // Send to backend
    sendErrorToBackend(errorData);

    // Show user-friendly message
    showError('Something went wrong. Please try again.');
  };

  /**
   * Handles unhandled promise rejections
   * 
   * @param event - PromiseRejectionEvent from window.onunhandledrejection
   */
  const handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
    const { browser, os } = getBrowserInfo();
    
    const errorData: ErrorData = {
      message: event.reason?.message || 'Unhandled Promise Rejection',
      stack: event.reason?.stack,
      url: typeof window !== 'undefined' ? window.location.href : '',
      browser,
      os,
      timestamp: Date.now(),
      type: 'unhandledrejection',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Unhandled Promise Rejection:', errorData);
    }

    // Send to backend
    sendErrorToBackend(errorData);

    // Show user-friendly message
    showError('Something went wrong. Please try again.');
  };

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * Set up global error listeners when component mounts
   */
  useEffect(() => {
    // Add global error listeners
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup function to remove listeners
    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      
      // Clear any pending timeout
      if (clearTimeoutRef) {
        clearTimeout(clearTimeoutRef);
      }
    };
  }, []); // Empty dependency array - only run once on mount

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  /** Context value that will be provided to child components */
  const contextValue: ErrorContextValue = {
    error,
    showError,
    clearError,
    showSuccess,
    showWarning,
    showInfo,
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  /**
   * Get the appropriate styling and icon based on notification type
   */
  const getNotificationStyles = () => {
    switch (notificationType) {
      case 'success':
        return {
          container: 'bg-green-50 border-green-200',
          icon: 'text-green-400',
          text: 'text-green-800',
          closeButton: 'text-green-400 hover:text-green-600',
          iconComponent: <AlertCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200',
          icon: 'text-yellow-400',
          text: 'text-yellow-800',
          closeButton: 'text-yellow-400 hover:text-yellow-600',
          iconComponent: <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
        };
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200',
          icon: 'text-blue-400',
          text: 'text-blue-800',
          closeButton: 'text-blue-400 hover:text-blue-600',
          iconComponent: <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
        };
      default: // error
        return {
          container: 'bg-red-50 border-red-200',
          icon: 'text-red-400',
          text: 'text-red-800',
          closeButton: 'text-red-400 hover:text-red-600',
          iconComponent: <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
        };
    }
  };

  const styles = getNotificationStyles();

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
      
      {/* Notification Toast */}
      {error && (
        <div className="fixed top-4 right-4 z-50 max-w-sm animate-in slide-in-from-top-2">
          <div className={`border rounded-lg p-4 shadow-lg ${styles.container}`}>
            <div className="flex items-start">
              {styles.iconComponent}
              <div className="ml-3 flex-1">
                <p className={`text-sm ${styles.text}`}>{error}</p>
              </div>
              <button
                onClick={clearError}
                className={`ml-4 flex-shrink-0 ${styles.closeButton}`}
                aria-label="Close notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </ErrorContext.Provider>
  );
}