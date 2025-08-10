"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AlertCircle, X } from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Interface for the error context value that will be provided to child components
 */
interface ErrorContextValue {
  /** Current error message (null if no error) */
  error: string | null;
  /** Function to show an error message */
  showError: (message: string) => void;
  /** Function to clear the current error */
  clearError: () => void;
}

/**
 * Interface for the ErrorProvider component props
 */
interface ErrorProviderProps {
  /** Child components that will have access to the error context */
  children: ReactNode;
  /** Optional auto-clear timeout in milliseconds (default: 5000) */
  autoClearTimeout?: number;
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
 * @returns ErrorContextValue - The error context value containing error state and functions
 * @throws Error if used outside of ErrorProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { error, showError, clearError } = useError();
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
// ERROR PROVIDER COMPONENT
// ============================================================================

/**
 * ErrorProvider component that provides error handling functionality
 * to all child components through React context.
 * 
 * Features:
 * - String-based error state management using useState
 * - Automatic error clearing after specified timeout
 * - User-friendly error notifications with toast UI
 * - TypeScript support with proper type definitions
 * 
 * @param props - ErrorProviderProps containing children and optional timeout
 * @returns JSX.Element - The provider component with context
 * 
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <ErrorProvider autoClearTimeout={5000}>
 *       <MyApp />
 *     </ErrorProvider>
 *   );
 * }
 * ```
 */
export function ErrorProvider({ 
  children, 
  autoClearTimeout = 5000 
}: ErrorProviderProps): JSX.Element {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  /** Current error message state - null when no error is present */
  const [error, setError] = useState<string | null>(null);
  
  /** Reference to the auto-clear timeout to prevent memory leaks */
  const [timeoutRef, setTimeoutRef] = useState<NodeJS.Timeout | null>(null);

  // ============================================================================
  // ERROR HANDLING FUNCTIONS
  // ============================================================================

  /**
   * Shows an error message and automatically clears it after the specified timeout
   * 
   * @param message - The error message to display
   */
  const showError = (message: string): void => {
    // Clear any existing timeout to prevent multiple timeouts
    if (timeoutRef) {
      clearTimeout(timeoutRef);
    }

    // Set the error message
    setError(message);

    // Set up auto-clear timeout
    const newTimeoutRef = setTimeout(() => {
      setError(null);
      setTimeoutRef(null);
    }, autoClearTimeout);

    setTimeoutRef(newTimeoutRef);
  };

  /**
   * Clears the current error message immediately
   */
  const clearError = (): void => {
    // Clear the timeout if it exists
    if (timeoutRef) {
      clearTimeout(timeoutRef);
      setTimeoutRef(null);
    }
    
    // Clear the error state
    setError(null);
  };

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  /** Context value that will be provided to child components */
  const contextValue: ErrorContextValue = {
    error,
    showError,
    clearError,
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
      
      {/* Error Toast Notification */}
      {error && (
        <div className="fixed top-4 right-4 z-50 max-w-sm animate-in slide-in-from-top-2">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="ml-3 flex-1">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="ml-4 flex-shrink-0 text-red-400 hover:text-red-600"
                aria-label="Close error notification"
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