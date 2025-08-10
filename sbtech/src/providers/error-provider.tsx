"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

/**
 * Type definition for the error context value
 * Contains the current error state and functions to manage it
 */
interface ErrorContextType {
  /** Current error message string, null if no error */
  error: string | null;
  /** Function to set a new error message */
  setError: (message: string) => void;
  /** Function to clear the current error */
  clearError: () => void;
}

/**
 * Create the error context with undefined as initial value
 * This will be provided by the ErrorProvider component
 */
const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

/**
 * Custom hook to access the error context
 * Must be used within an ErrorProvider component
 * 
 * @returns ErrorContextType - The error context value
 * @throws Error if used outside of ErrorProvider
 */
export function useError(): ErrorContextType {
  const context = useContext(ErrorContext);
  
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  
  return context;
}

/**
 * Props interface for the ErrorProvider component
 */
interface ErrorProviderProps {
  /** Child components that will have access to the error context */
  children: ReactNode;
}

/**
 * ErrorProvider component that manages error state using React Context
 * Provides error state management to all child components
 * 
 * @param children - Child components to wrap with error context
 * @returns React.JSX.Element - Provider component with error context
 */
export function ErrorProvider({ children }: ErrorProviderProps): React.JSX.Element {
  // State to store the current error message
  // null means no error, string contains the error message
  const [error, setErrorState] = useState<string | null>(null);

  /**
   * Function to set a new error message
   * @param message - The error message to display
   */
  const setError = (message: string): void => {
    setErrorState(message);
  };

  /**
   * Function to clear the current error
   * Sets error state back to null
   */
  const clearError = (): void => {
    setErrorState(null);
  };

  // Create the context value object
  const contextValue: ErrorContextType = {
    error,
    setError,
    clearError,
  };

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
    </ErrorContext.Provider>
  );
}