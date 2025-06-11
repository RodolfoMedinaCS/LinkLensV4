import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  // 1. Check for an active session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // 2. Parse the request body for the URL
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { url } = body;
  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  // 3. Insert a new record into the 'links' table with 'pending' status
  const { data: newLink, error: insertError } = await supabase
    .from('links')
    .insert({ url: url, user_id: session.user.id, status: 'pending' })
    .select()
    .single();

  if (insertError) {
    // Handle potential unique constraint violation (link already exists)
    if (insertError.code === '23505') { // unique_violation
      return NextResponse.json({ error: 'Link already exists for this user' }, { status: 409 });
    }
    console.error('Error inserting link:', insertError);
    return NextResponse.json({ error: 'Failed to create new link record' }, { status: 500 });
  }

  // 4. Asynchronously trigger the AI engine to scrape the link
  // We don't await this fetch call, so the API returns immediately.
  const aiEngineUrl = process.env.AI_ENGINE_URL || 'http://127.0.0.1:8001';
  fetch(`${aiEngineUrl}/scrape`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: newLink.url, link_id: newLink.id }),
  }).catch(error => {
    // Log the error, but don't block the user response.
    // In production, you'd want more robust error handling here,
    // like a retry queue or a monitoring service.
    console.error(`Failed to trigger AI engine for link_id ${newLink.id}:`, error);
  });

  // 5. Return the newly created link record to the client
  return NextResponse.json({
    success: true,
    message: 'Link capture initiated. Processing will complete in the background.',
    data: newLink,
  });
} 