import React from 'react';
import AuthForm from '../../components/AuthForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | LinkLens',
  description: 'Sign in to your LinkLens account - Your AI-powered bookmark manager'
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1117] px-4 py-12">
      <AuthForm view="sign_in" />
    </div>
  );
} 