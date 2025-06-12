import React from 'react';
import SignupForm from '../../components/SignupForm';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | LinkLens',
  description: 'Create a LinkLens account - Start organizing your links with AI'
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md mx-auto p-6 space-y-8 bg-card border border-border rounded-sm">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-text-primary mb-2">
            Create a LinkLens account
          </h1>
          <p className="text-text-secondary text-sm mb-6">
            Start organizing your links with AI
          </p>
        </div>
        
        <SignupForm />
        
        <div className="text-center text-sm text-text-secondary mt-6">
          <p>
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary hover:text-primary-hover">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 