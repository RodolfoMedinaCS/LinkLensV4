import React from 'react';
import SettingsNav from '../../components/SettingsNav';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">Settings</h1>
        <p className="text-text-secondary mb-8">Manage your account, profile, and billing settings.</p>
        <SettingsNav />
        <div>
            {children}
        </div>
    </div>
  );
} 