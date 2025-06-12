"use client";

import React, { useState } from 'react';
import { createBrowserClient } from '../../lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginForm({ redirectTo = '/dashboard' }: { redirectTo?: string }) {
  const supabase = createBrowserClient();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Check for the 'source' query parameter
      const params = new URLSearchParams(window.location.search);
      if (params.get('source') === 'extension') {
        // Redirect to a page that will send the session to the extension
        router.push('/auth/extension-callback');
        return;
      }

      // Successful login, redirect to dashboard
      router.push(redirectTo);
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-opacity-20 bg-error border border-error text-error p-3 rounded-sm text-sm mb-4">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-card border-b border-border focus:border-primary transition-colors focus:outline-none px-3 py-2"
            placeholder="you@example.com"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-card border-b border-border focus:border-primary transition-colors focus:outline-none px-3 py-2"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-hover text-text-primary rounded-sm py-2 px-4 transition-colors disabled:opacity-70"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
} 