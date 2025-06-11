"use client";

import React, { useState, useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type AuthFormProps = {
  view: 'sign_in' | 'sign_up';
  redirectTo?: string;
};

export default function AuthForm({ view, redirectTo = '/dashboard' }: AuthFormProps) {
  const supabase = createClient();
  const [origin, setOrigin] = useState<string>('');
  
  useEffect(() => {
    // Set the origin in a useEffect to avoid SSR issues with window
    setOrigin(window.location.origin);
  }, []);
  
  // Custom theme to match Focus Terminal design system
  const customTheme = {
    default: {
      colors: {
        brand: '#3E63DD', // Electric Blue accent
        brandAccent: '#2a4ec2',
        brandButtonText: '#FFFFFF', // White text on buttons
        inputBackground: '#161B22', // Card BG
        inputBorder: '#21262D', // Borders
        inputText: '#FFFFFF', // White text
        inputPlaceholder: '#8A94A4', // Muted Gray
        messageText: '#FFFFFF',
        messageTextDanger: '#E5534B', // Error color
        anchorTextColor: '#3E63DD', // Electric Blue for links
        defaultButtonBackground: '#0D1117', // Near Black bg
        defaultButtonBackgroundHover: '#161B22',
        defaultButtonBorder: '#21262D',
        defaultButtonText: '#FFFFFF',
      },
      fontSizes: {
        baseBodySize: '14px',
        baseInputSize: '14px',
        baseLabelSize: '14px',
        baseButtonSize: '14px',
      },
      fonts: {
        bodyFontFamily: `'Inter', sans-serif`,
        buttonFontFamily: `'Inter', sans-serif`,
        inputFontFamily: `'Inter', sans-serif`,
        labelFontFamily: `'Inter', sans-serif`,
      },
      space: {
        inputPadding: '12px',
        buttonPadding: '12px 16px',
        labelBottomMargin: '8px',
        anchorBottomMargin: '4px',
        emailInputSpacing: '4px',
        socialAuthSpacing: '8px',
        dividerMargin: '16px',
      },
      borderWidths: {
        buttonBorderWidth: '1px',
        inputBorderWidth: '1px',
      },
      radii: {
        borderRadiusButton: '2px',
        buttonBorderRadius: '2px',
        inputBorderRadius: '2px',
      },
    },
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-8 bg-[#161B22] border border-[#21262D] rounded-sm">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-white mb-2">
          {view === 'sign_in' ? 'Sign in to LinkLens' : 'Create a LinkLens account'}
        </h1>
        <p className="text-[#8A94A4] text-sm mb-6">
          {view === 'sign_in' 
            ? 'Your AI-powered bookmark manager' 
            : 'Start organizing your links with AI'}
        </p>
      </div>
      
      <Auth
        supabaseClient={supabase}
        view={view}
        appearance={{ theme: ThemeSupa, variables: customTheme }}
        theme="dark"
        showLinks={true}
        providers={['google', 'github']}
        redirectTo={origin ? `${origin}${redirectTo}` : redirectTo}
        socialLayout="horizontal"
      />
      
      <div className="text-center text-sm text-[#8A94A4] mt-6">
        {view === 'sign_in' ? (
          <p>
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-[#3E63DD] hover:text-[#2a4ec2]">
              Sign up
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#3E63DD] hover:text-[#2a4ec2]">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
} 