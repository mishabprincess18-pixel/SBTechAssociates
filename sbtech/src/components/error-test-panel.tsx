"use client";
import React from 'react';
import { useError } from '@/providers/error-provider';
import { Bug, Zap, AlertTriangle, Database, Clock, Cpu } from 'lucide-react';

export function ErrorTestPanel() {
  const { setError } = useError();

  const triggerRuntimeError = () => {
    throw new Error('This is a test runtime error from the frontend');
  };

  const triggerAsyncError = async () => {
    try {
      await fetch('/api/test-error?type=async');
    } catch (error) {
      setError('Async operation failed');
    }
  };

  const triggerPromiseRejection = () => {
    Promise.reject(new Error('Test promise rejection'));
  };

  const triggerNetworkError = async () => {
    try {
      await fetch('/api/non-existent-endpoint');
    } catch (error) {
      setError('Network request failed');
    }
  };

  const triggerCustomError = () => {
    setError('This is a custom error message for testing');
  };

  const triggerBackendError = async () => {
    try {
      const response = await fetch('/api/test-error?type=runtime');
      const data = await response.json();
      if (!data.success) {
        setError(data.error || 'Backend error occurred');
      }
    } catch (error) {
      setError('Failed to communicate with backend');
    }
  };

  const testButtons = [
    {
      label: 'Runtime Error',
      icon: Bug,
      onClick: triggerRuntimeError,
      color: 'bg-red-500 hover:bg-red-600',
    },
    {
      label: 'Async Error',
      icon: Clock,
      onClick: triggerAsyncError,
      color: 'bg-yellow-500 hover:bg-yellow-600',
    },
    {
      label: 'Promise Rejection',
      icon: Zap,
      onClick: triggerPromiseRejection,
      color: 'bg-orange-500 hover:bg-orange-600',
    },
    {
      label: 'Network Error',
      icon: AlertTriangle,
      onClick: triggerNetworkError,
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      label: 'Backend Error',
      icon: Database,
      onClick: triggerBackendError,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      label: 'Custom Error',
      icon: Cpu,
      onClick: triggerCustomError,
      color: 'bg-green-500 hover:bg-green-600',
    },
  ];

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Error Test Panel</h3>
        <span className="text-xs text-gray-500">Dev Only</span>
      </div>
      <div className="space-y-2">
        {testButtons.map((button, index) => (
          <button
            key={index}
            onClick={button.onClick}
            className={`w-full flex items-center justify-center px-3 py-2 text-xs font-medium text-white rounded-md transition-colors ${button.color}`}
          >
            <button.icon className="h-3 w-3 mr-2" />
            {button.label}
          </button>
        ))}
      </div>
      <div className="mt-3 text-xs text-gray-500">
        Check console and logs for error details
      </div>
    </div>
  );
}