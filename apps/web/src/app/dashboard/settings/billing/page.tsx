'use client';

import Link from 'next/link';

export default function Billing() {
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Billing</h1>
        <Link 
          href="/dashboard/settings" 
          className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
        >
          Back to Settings
        </Link>
      </div>
      
      <div className="mb-6 rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-medium">Current Plan</h2>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <div className="mb-1 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
              Free Plan
            </div>
            <p className="mt-2 text-sm text-gray-600">
              You are currently on the free plan. Upgrade to Pro for additional features.
            </p>
          </div>
          <button
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            onClick={() => alert('Upgrade functionality will be implemented in future releases')}
          >
            Upgrade to Pro
          </button>
        </div>
      </div>
      
      <div className="mb-6 rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-medium">Plan Comparison</h2>
        </div>
        <div className="p-6">
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Feature</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Free</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Pro</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-4 text-sm">Links</td>
                  <td className="py-4 text-sm">Up to 100</td>
                  <td className="py-4 text-sm">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 text-sm">Smart Clusters</td>
                  <td className="py-4 text-sm">Basic</td>
                  <td className="py-4 text-sm">Advanced</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 text-sm">Semantic Search</td>
                  <td className="py-4 text-sm">Limited</td>
                  <td className="py-4 text-sm">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-4 text-sm">Collaboration</td>
                  <td className="py-4 text-sm">-</td>
                  <td className="py-4 text-sm">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-medium">Payment Method</h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600">
            Payment methods will be available when you upgrade to a paid plan.
          </p>
        </div>
      </div>
    </div>
  );
} 