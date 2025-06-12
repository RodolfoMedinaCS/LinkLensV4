"use client";

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SignupForm({ redirectTo = '/dashboard' }: { redirectTo?: string }) {
  const supabase = createClient();
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + redirectTo
        }
      });

      if (error) {
        setError(error.message);
        return;
      }

      // If email confirmation is required, show a message
      // Otherwise redirect to dashboard
      router.push(redirectTo);
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Signup error:', err);
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
            placeholder="At least 6 characters"
            minLength={6}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-hover text-text-primary rounded-sm py-2 px-4 transition-colors disabled:opacity-70"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </div>
  );
} 