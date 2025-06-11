'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase/client';

export default function SupabaseTest() {
  const [version, setVersion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkSupabase() {
      try {
        // This is just a simple query to verify the connection
        const { data, error } = await supabase.from('pg_stat_statements').select('version()').limit(1);
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          setVersion(data[0].version);
        } else {
          setVersion('Connection successful, but no version data returned');
        }
      } catch (err) {
        console.error('Supabase connection error:', err);
        setError(`Connection failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    checkSupabase();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-lg font-bold mb-2">Supabase Connection Status</h2>
      {error ? (
        <div className="text-red-500">
          <p>Error: {error}</p>
          <p className="mt-2 text-sm">
            Note: This is expected if you haven&apos;t set up Supabase yet or are using placeholder credentials.
          </p>
        </div>
      ) : version ? (
        <div className="text-green-500">
          <p>Connected to Supabase!</p>
          <p>PostgreSQL version: {version}</p>
        </div>
      ) : (
        <div className="text-blue-500">
          <p>Checking connection...</p>
        </div>
      )}
    </div>
  );
} 