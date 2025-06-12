import { getSession } from '@/lib/supabase/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  } else {
    redirect('/auth/login');
  }

  // This won't be reached due to redirect, but needed for TypeScript
  return null;
} 