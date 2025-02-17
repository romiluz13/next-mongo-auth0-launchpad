'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';
import { 
  BeakerIcon, 
  CodeBracketIcon,
  DocumentTextIcon,
  CubeIcon,
  KeyIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface UserData {
  createdAt: string;
  updatedAt: string;
  _id: string;
}

interface ApiKey {
  key: string;
  name: string;
  createdAt: string;
}

interface DatabaseStats {
  collections: number;
  documents: number;
  storageSize: string;
}

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [dbStats, setDbStats] = useState<DatabaseStats | null>(null);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      // Fetch user data and stats
      Promise.all([
        fetch('/api/user').then(res => res.json()),
        fetch('/api/dashboard/stats').then(res => res.json()),
        fetch('/api/keys').then(res => res.json())
      ]).then(([userData, stats, keys]) => {
        setUserData(userData);
        setDbStats(stats);
        setApiKeys(keys);
      }).catch(error => console.error('Error fetching dashboard data:', error));
    }
  }, [user]);

  const generateApiKey = async () => {
    if (!newKeyName) return;
    
    setIsGeneratingKey(true);
    try {
      const res = await fetch('/api/keys/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName })
      });
      const data = await res.json();
      setNewKey(data.key);
      setApiKeys(prev => [...prev, { key: data.key, name: newKeyName, createdAt: new Date().toISOString() }]);
      setNewKeyName('');
      setShowNewKeyModal(false);
    } catch (error) {
      console.error('Error generating API key:', error);
    } finally {
      setIsGeneratingKey(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome to Your Developer Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Here's everything you need to start building with MongoDB, Next.js, and Auth0.
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Database Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
              <CubeIcon className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Database Stats</h3>
              {dbStats ? (
                <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <p>Collections: {dbStats.collections}</p>
                  <p>Documents: {dbStats.documents}</p>
                  <p>Storage: {dbStats.storageSize}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Loading stats...</p>
              )}
            </div>
          </div>
        </div>

        {/* API Keys */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                <KeyIcon className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">API Keys</h3>
            </div>
            <button
              onClick={() => setShowNewKeyModal(true)}
              className="text-sm px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              New Key
            </button>
          </div>
          <div className="space-y-2">
            {apiKeys.map((key, index) => (
              <div key={index} className="text-sm p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div className="font-medium text-gray-900 dark:text-white">{key.name}</div>
                <div className="text-gray-500 dark:text-gray-400">Created: {new Date(key.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
              <CodeBracketIcon className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Links</h3>
          </div>
          <div className="space-y-2">
            <a
              href="/docs/getting-started"
              className="block p-2 text-sm text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
            >
              📚 Getting Started Guide
            </a>
            <a
              href="/docs/api-reference"
              className="block p-2 text-sm text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
            >
              🔧 API Reference
            </a>
            <a
              href="/docs/examples"
              className="block p-2 text-sm text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
            >
              💡 Example Projects
            </a>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Development Activity
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
              <BeakerIcon className="w-5 h-5 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Database Connected
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                MongoDB connection established successfully
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
              <ArrowPathIcon className="w-5 h-5 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Auth0 Integration Active
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Authentication system is ready
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
              <DocumentTextIcon className="w-5 h-5 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                API Documentation Updated
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Latest API endpoints and examples added
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* New API Key Modal */}
      {showNewKeyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Generate New API Key</h3>
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Enter key name"
              className="w-full p-2 border rounded-md mb-4 dark:bg-gray-700 dark:border-gray-600"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowNewKeyModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={generateApiKey}
                disabled={isGeneratingKey || !newKeyName}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {isGeneratingKey ? 'Generating...' : 'Generate Key'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Key Display Modal */}
      {newKey && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your New API Key</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Make sure to copy your API key now. You won't be able to see it again!
            </p>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md font-mono text-sm mb-4">
              {newKey}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setNewKey(null)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 