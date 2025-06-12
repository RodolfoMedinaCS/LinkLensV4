import React from 'react';
import LoginForm from '../../components/LoginForm';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | LinkLens',
  description: 'Sign in to your LinkLens account - Your AI-powered bookmark manager'
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md mx-auto p-6 space-y-8 bg-card border border-border rounded-sm">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-text-primary mb-2">
            Sign in to LinkLens
          </h1>
          <p className="text-text-secondary text-sm mb-6">
            Your AI-powered bookmark manager
          </p>
        </div>
        
        <LoginForm />
        
        <div className="text-center text-sm text-text-secondary mt-6">
          <p>
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-primary hover:text-primary-hover">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 