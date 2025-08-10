"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorContextType {
  showError: (message: string) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function useError() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
}

interface ErrorProviderProps {
  children: React.ReactNode;
}

export function ErrorProvider({ children }: ErrorProviderProps) {
  const [error, setError] = useState<string | null>(null);

  const showError = (message: string) => {
    setError(message);
    // Auto-clear after 5 seconds
    setTimeout(() => setError(null), 5000);
  };

  const clearError = () => setError(null);

  // Collect browser and OS information
  const getBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    let browser = 'Unknown';
    let os = 'Unknown';

    // Detect browser
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    // Detect OS
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';

    return { browser, os };
  };

  // Send error to backend
  const sendErrorToBackend = async (errorData: any) => {
    try {
      await fetch('/api/error-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData),
      });
    } catch (err) {
      // Silently fail to avoid infinite loops
      console.warn('Failed to send error to backend:', err);
    }
  };

  // Global error handler
  const handleGlobalError = (event: ErrorEvent) => {
    const { browser, os } = getBrowserInfo();
    
    const errorData = {
      message: event.message,
      stack: event.error?.stack,
      url: window.location.href,
      lineNumber: event.lineno,
      columnNumber: event.colno,
      browser,
      os,
      timestamp: Date.now(),
      type: 'error' as const,
      userAgent: navigator.userAgent,
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

  // Unhandled promise rejection handler
  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    const { browser, os } = getBrowserInfo();
    
    const errorData = {
      message: event.reason?.message || 'Unhandled Promise Rejection',
      stack: event.reason?.stack,
      url: window.location.href,
      browser,
      os,
      timestamp: Date.now(),
      type: 'unhandledrejection' as const,
      userAgent: navigator.userAgent,
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

  // React error boundary fallback
  const handleReactError = (error: Error, errorInfo: React.ErrorInfo) => {
    const { browser, os } = getBrowserInfo();
    
    const errorData = {
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      browser,
      os,
      timestamp: Date.now(),
      type: 'error' as const,
      userAgent: navigator.userAgent,
      componentStack: errorInfo.componentStack,
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('React Error:', errorData);
    }

    // Send to backend
    sendErrorToBackend(errorData);

    // Show user-friendly message
    showError('Something went wrong. Please try again.');
  };

  useEffect(() => {
    // Set up global error listeners
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Set up React error boundary
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Call original console.error
      originalConsoleError.apply(console, args);
      
      // Check if it's a React error
      const errorString = args.join(' ');
      if (errorString.includes('React') || errorString.includes('Error:')) {
        const error = new Error(errorString);
        handleReactError(error, { componentStack: '' });
      }
    };

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      console.error = originalConsoleError;
    };
  }, []);

  return (
    <ErrorContext.Provider value={{ showError, clearError }}>
      {children}
      
      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="ml-3 flex-1">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="ml-4 flex-shrink-0 text-red-400 hover:text-red-600"
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