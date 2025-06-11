'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function SettingsPage() {
  const [email, setEmail] = useState('user@example.com');
  const [notifications, setNotifications] = useState(true);
  const [autoCluster, setAutoCluster] = useState(true);

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary mb-2">Settings</h1>
          <p className="text-secondary">
            Manage your account and preferences
          </p>
        </div>
        
        <div className="space-y-8">
          {/* Account Settings */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-primary mb-4">Account</h2>
            <div className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="flex gap-3">
                <Button variant="secondary">Change Password</Button>
                <Button variant="ghost">Sign Out</Button>
              </div>
            </div>
          </div>
          
          {/* Preferences */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-primary mb-4">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary">Email Notifications</p>
                  <p className="text-sm text-secondary">Receive updates about new clusters</p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 border transition-colors ${
                    notifications 
                      ? 'bg-accent border-accent' 
                      : 'bg-card border-border'
                  }`}
                >
                  <div className={`w-4 h-4 bg-primary transition-transform ${
                    notifications ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary">Auto-clustering</p>
                  <p className="text-sm text-secondary">Automatically create clusters from new links</p>
                </div>
                <button
                  onClick={() => setAutoCluster(!autoCluster)}
                  className={`w-12 h-6 border transition-colors ${
                    autoCluster 
                      ? 'bg-accent border-accent' 
                      : 'bg-card border-border'
                  }`}
                >
                  <div className={`w-4 h-4 bg-primary transition-transform ${
                    autoCluster ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Plan */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-primary mb-4">Plan</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-primary">Free Plan</p>
                <p className="text-sm text-secondary">Up to 100 links, basic clustering</p>
              </div>
              <Button variant="secondary">Upgrade</Button>
            </div>
          </div>
          
          {/* Danger Zone */}
          <div className="card p-6 border-error">
            <h2 className="text-lg font-semibold text-error mb-4">Danger Zone</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-primary">Delete Account</p>
                <p className="text-sm text-secondary">Permanently delete your account and all data</p>
              </div>
              <Button 
                variant="secondary" 
                className="border-error text-error hover:bg-error hover:text-primary"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}