'use client';

import { useState } from 'react';
import { ConfigFormData, ConfigValidationResult } from '@/lib/types/steam';

interface ConfigFormProps {
  onSubmit: (config: ConfigFormData) => Promise<void>;
  initialConfig?: ConfigFormData;
  isLoading?: boolean;
}

export function ConfigForm({ onSubmit, initialConfig, isLoading }: ConfigFormProps) {
  const [formData, setFormData] = useState<ConfigFormData>(
    initialConfig || { steamApiKey: '', steamId: '' }
  );
  const [errors, setErrors] = useState<ConfigValidationResult['errors']>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      await onSubmit(formData);
    } catch (error) {
      // 在客户端组件中使用console.error保持兼容性
      console.error('配置表单提交失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof ConfigFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="steamApiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Steam API Key
        </label>
        <input
          type="password"
          id="steamApiKey"
          value={formData.steamApiKey}
          onChange={(e) => handleChange('steamApiKey', e.target.value)}
          placeholder="Enter your Steam API Key"
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
            errors.steamApiKey ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading || isSubmitting}
        />
        {errors.steamApiKey && (
          <p className="mt-1 text-sm text-red-600">{errors.steamApiKey}</p>
        )}
      </div>

      <div>
        <label htmlFor="steamId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Steam ID
        </label>
        <input
          type="text"
          id="steamId"
          value={formData.steamId}
          onChange={(e) => handleChange('steamId', e.target.value)}
          placeholder="Enter your Steam ID (17-digit number)"
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
            errors.steamId ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading || isSubmitting}
        />
        {errors.steamId && (
          <p className="mt-1 text-sm text-red-600">{errors.steamId}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Saving...' : 'Save Configuration'}
      </button>
    </form>
  );
}

interface ConfigGuideProps {
  className?: string;
}

export function ConfigGuide({ className }: ConfigGuideProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Configuration Guide
        </h3>
        <p className="text-blue-800 dark:text-blue-200 text-sm">
          Follow these steps to configure your Steam profile access:
        </p>
      </div>

      <div className="space-y-4">
        <div className="border-l-4 border-blue-500 pl-4">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Step 1: Get Your Steam API Key
          </h4>
          <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>1. Go to <a href="https://steamcommunity.com/dev/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Steam Web API Key</a></li>
            <li>2. Log in with your Steam account</li>
            <li>3. Enter any domain name (e.g., &quot;localhost&quot;)</li>
            <li>4. Copy the generated API key</li>
          </ol>
        </div>

        <div className="border-l-4 border-green-500 pl-4">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Step 2: Find Your Steam ID
          </h4>
          <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>1. Go to <a href="https://steamid.io/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">SteamID.io</a></li>
            <li>2. Enter your Steam profile URL or username</li>
            <li>3. Copy the &quot;steamID64&quot; number (17 digits)</li>
          </ol>
        </div>

        <div className="border-l-4 border-yellow-500 pl-4">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Step 3: Configure Below
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enter your API key and Steam ID in the form above, then click &quot;Save Configuration&quot;.
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
          Security Note
        </h4>
        <p className="text-yellow-800 dark:text-yellow-200 text-sm">
          Your API key is encrypted and stored securely. It&aposs only used to fetch your Steam profile data.
        </p>
      </div>
    </div>
  );
}