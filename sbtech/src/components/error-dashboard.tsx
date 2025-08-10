"use client";
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Bug, Clock, Database, RefreshCw, Trash2 } from 'lucide-react';

interface ErrorStats {
  total: number;
  frontend: number;
  backend: number;
  today: number;
  thisWeek: number;
}

interface ErrorLog {
  message: string;
  type: string;
  timestamp: number;
  url?: string;
  browser?: string;
  os?: string;
}

export function ErrorDashboard() {
  const [stats, setStats] = useState<ErrorStats>({
    total: 0,
    frontend: 0,
    backend: 0,
    today: 0,
    thisWeek: 0,
  });
  const [recentErrors, setRecentErrors] = useState<ErrorLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadErrorData = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, you would fetch from your error monitoring service
      // For now, we'll simulate with localStorage or mock data
      const mockStats: ErrorStats = {
        total: 42,
        frontend: 28,
        backend: 14,
        today: 3,
        thisWeek: 12,
      };

      const mockErrors: ErrorLog[] = [
        {
          message: 'Network request failed',
          type: 'frontend',
          timestamp: Date.now() - 1000 * 60 * 5, // 5 minutes ago
          url: '/contact',
          browser: 'Chrome',
          os: 'Windows',
        },
        {
          message: 'Database connection timeout',
          type: 'backend',
          timestamp: Date.now() - 1000 * 60 * 15, // 15 minutes ago
        },
        {
          message: 'Validation error: Invalid email format',
          type: 'frontend',
          timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
          url: '/auth/login',
          browser: 'Firefox',
          os: 'macOS',
        },
      ];

      setStats(mockStats);
      setRecentErrors(mockErrors);
    } catch (error) {
      console.error('Failed to load error data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearErrorLogs = async () => {
    try {
      // In a real implementation, you would call an API to clear logs
      setStats({
        total: 0,
        frontend: 0,
        backend: 0,
        today: 0,
        thisWeek: 0,
      });
      setRecentErrors([]);
    } catch (error) {
      console.error('Failed to clear error logs:', error);
    }
  };

  useEffect(() => {
    loadErrorData();
  }, []);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 1000 * 60) return 'Just now';
    if (diff < 1000 * 60 * 60) return `${Math.floor(diff / (1000 * 60))}m ago`;
    if (diff < 1000 * 60 * 60 * 24) return `${Math.floor(diff / (1000 * 60 * 60))}h ago`;
    return date.toLocaleDateString();
  };

  const getErrorTypeIcon = (type: string) => {
    switch (type) {
      case 'frontend':
        return <Bug className="h-4 w-4 text-blue-500" />;
      case 'backend':
        return <Database className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">Error Dashboard</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={loadErrorData}
            disabled={isLoading}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={clearErrorLogs}
            className="p-1 text-gray-400 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Error Statistics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center">
            <Bug className="h-4 w-4 text-blue-500 mr-2" />
            <span className="text-xs text-blue-700">Frontend</span>
          </div>
          <div className="text-lg font-semibold text-blue-900">{stats.frontend}</div>
        </div>
        <div className="bg-red-50 p-3 rounded-lg">
          <div className="flex items-center">
            <Database className="h-4 w-4 text-red-500 mr-2" />
            <span className="text-xs text-red-700">Backend</span>
          </div>
          <div className="text-lg font-semibold text-red-900">{stats.backend}</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-xs text-green-700">Today</span>
          </div>
          <div className="text-lg font-semibold text-green-900">{stats.today}</div>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-purple-500 mr-2" />
            <span className="text-xs text-purple-700">This Week</span>
          </div>
          <div className="text-lg font-semibold text-purple-900">{stats.thisWeek}</div>
        </div>
      </div>

      {/* Recent Errors */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-gray-700">Recent Errors</h4>
        {recentErrors.length === 0 ? (
          <p className="text-xs text-gray-500">No recent errors</p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {recentErrors.map((error, index) => (
              <div key={index} className="bg-gray-50 p-2 rounded text-xs">
                <div className="flex items-start justify-between">
                  <div className="flex items-center flex-1">
                    {getErrorTypeIcon(error.type)}
                    <span className="ml-2 text-gray-900 truncate">{error.message}</span>
                  </div>
                  <span className="text-gray-500 ml-2">{formatTimestamp(error.timestamp)}</span>
                </div>
                {error.url && (
                  <div className="text-gray-500 mt-1 truncate">{error.url}</div>
                )}
                {(error.browser || error.os) && (
                  <div className="text-gray-400 mt-1">
                    {error.browser} • {error.os}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 text-xs text-gray-500">
        Total: {stats.total} errors
      </div>
    </div>
  );
}