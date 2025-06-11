import React from 'react';
import DangerZone from '@/app/components/DangerZone';

const ProfileForm = () => (
    <div className="space-y-4">
        <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-text-primary mb-1">
                Full Name
            </label>
            <input
                id="fullName"
                name="fullName"
                type="text"
                defaultValue="Rodolfo" // Mock data
                className="w-full max-w-sm bg-card border-b border-border focus:border-primary transition-colors focus:outline-none px-3 py-2"
            />
        </div>
        <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
                Email Address
            </label>
            <input
                id="email"
                name="email"
                type="email"
                defaultValue="rodolfo.marquez@gmail.com" // Mock data
                disabled
                className="w-full max-w-sm bg-card/50 border-b border-border transition-colors focus:outline-none px-3 py-2 text-text-secondary"
            />
        </div>
        <button
            type="submit"
            className="bg-primary hover:bg-primary-hover text-text-primary font-semibold py-2 px-4 rounded-sm text-sm transition-colors"
        >
            Update Profile
        </button>
    </div>
);


export default function ProfilePage() {
    return (
        <div>
            <h2 className="text-xl font-bold text-text-primary mb-4">Profile</h2>
            <p className="text-text-secondary mb-6">This is how others will see you on the site.</p>
            <ProfileForm />
            <DangerZone />
        </div>
    );
} 