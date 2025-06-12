"use client";

import React, { useState } from 'react';

export default function DangerZone() {
    const [confirming, setConfirming] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const confirmationText = 'delete my account';

    const handleDelete = () => {
        // In a real app, this would trigger an API call to delete the user's data
        console.log('Account deletion initiated...');
        alert('Account deleted!');
    };

    return (
        <div className="mt-12 p-4 border border-error/50 rounded-sm bg-error/10">
            <h3 className="text-lg font-semibold text-error">Danger Zone</h3>
            <p className="text-text-secondary mt-1 text-sm">
                Deleting your account is a permanent action and cannot be undone. All your links, folders, and clusters will be removed.
            </p>
            {!confirming ? (
                <button
                    onClick={() => setConfirming(true)}
                    className="mt-4 bg-error hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-sm text-sm transition-colors"
                >
                    Delete Account
                </button>
            ) : (
                <div className="mt-4 space-y-4">
                    <p className="text-text-secondary text-sm">
                        To confirm, please type "<span className="font-mono text-error">{confirmationText}</span>" in the box below.
                    </p>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-full bg-card border-b border-error focus:border-red-700 transition-colors focus:outline-none px-3 py-2"
                    />
                    <button
                        onClick={handleDelete}
                        disabled={inputValue !== confirmationText}
                        className="w-full bg-error hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-sm text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        I understand the consequences, delete my account
                    </button>
                    <button
                        onClick={() => setConfirming(false)}
                        className="w-full bg-transparent hover:bg-background text-text-secondary font-semibold py-2 px-4 rounded-sm text-sm transition-colors mt-2"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
} 