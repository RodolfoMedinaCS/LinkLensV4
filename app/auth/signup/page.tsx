import React from 'react';
import AuthForm from '../../components/AuthForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | LinkLens',
  description: 'Create a LinkLens account - Start organizing your links with AI'
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1117] px-4 py-12">
      <AuthForm view="sign_up" />
    </div>
  );
} 