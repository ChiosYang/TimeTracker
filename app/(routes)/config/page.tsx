'use client';

import { useState, useEffect } from 'react';
import { ConfigForm, ConfigGuide } from '@/components/config/config-form';
import { ConfigFormData } from '@/lib/types/steam';

export default function ConfigPage() {
  const [config, setConfig] = useState<ConfigFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // 检查是否已有配置
    checkExistingConfig();
  }, []);

  const checkExistingConfig = async () => {
    try {
      const response = await fetch('/api/config/steam');
      if (response.ok) {
        const data = await response.json();
        if (data.config) {
          setConfig(data.config);
        }
      }
    } catch (error) {
      console.error('Failed to check existing config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: ConfigFormData) => {
    try {
      const response = await fetch('/api/config/steam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Configuration saved successfully!' });
        setConfig(formData);
        // 3秒后重定向到dashboard
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 3000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save configuration' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
      console.error('Config submission error:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your Steam configuration?')) {
      return;
    }

    try {
      const response = await fetch('/api/config/steam', {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Configuration deleted successfully!' });
        setConfig(null);
      } else {
        setMessage({ type: 'error', text: 'Failed to delete configuration' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
      console.error('Config deletion error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Steam Configuration
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Configure your Steam API credentials to access your profile data
        </p>
      </header>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200' 
            : 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200'
        }`}>
          {message.text}
          {message.type === 'success' && (
            <div className="mt-2 text-sm">
              Redirecting to dashboard in 3 seconds...
            </div>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {config ? 'Update Configuration' : 'Steam Configuration'}
            </h2>
            
            <ConfigForm
              onSubmit={handleSubmit}
              initialConfig={config || undefined}
              isLoading={isLoading}
            />

            {config && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Current Configuration
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Steam ID:</span>
                    <span className="text-gray-900 dark:text-gray-100 font-mono">{config.steamId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">API Key:</span>
                    <span className="text-gray-900 dark:text-gray-100 font-mono">••••••••••••••••</span>
                  </div>
                </div>
                <button
                  onClick={handleDelete}
                  className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                >
                  Delete Configuration
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <ConfigGuide />
        </div>
      </div>

      <div className="mt-8 text-center">
        <a
          href="/dashboard"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200 dark:hover:bg-blue-900/30"
        >
          ← Back to Dashboard
        </a>
      </div>
    </div>
  );
}