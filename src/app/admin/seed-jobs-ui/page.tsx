'use client';

import { useState } from 'react';

export default function SeedJobsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSeed = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/admin/seed-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.message || data.error || 'Failed to seed jobs');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 pt-32">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Seed Job Postings
          </h1>

          <p className="text-gray-600 mb-6">
            This will create 9 ALIFF-RECRUITER job postings in your database.
            Only run this once on initial setup.
          </p>

          <button
            onClick={handleSeed}
            disabled={loading}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Seeding Database...' : 'Seed Job Postings'}
          </button>

          {result && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h2 className="text-lg font-semibold text-green-900 mb-2">
                ✅ Success!
              </h2>
              <p className="text-green-800">
                {result.message}
              </p>
              {result.count && (
                <p className="text-green-700 mt-2">
                  Created {result.count} job postings
                </p>
              )}
              <a
                href="/careers"
                className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium"
              >
                View Careers Page →
              </a>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h2 className="text-lg font-semibold text-red-900 mb-2">
                ❌ Error
              </h2>
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {loading && (
            <div className="mt-6 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Processing...</span>
            </div>
          )}
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Information</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• This creates 9 job postings with updated PKR rates</li>
            <li>• All jobs will be published and visible on /careers</li>
            <li>• If jobs already exist, you'll get an error</li>
            <li>• Delete this page after seeding for security</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
