import { createSupabaseServerClient } from '../../../lib/supabase/server';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { z } from 'zod';

// Schema hardened based on senior developer feedback (Phase 1).
const CreateLinkSchema = z.object({
  url: z.string().url(),
  title: z.string().max(300), // Max length guard
  pageContent: z.string().optional().nullable(),
  excerpt: z.string().max(1000).optional().nullable(), // Max length guard
  byline: z.string().max(200).optional().nullable(), // Max length guard
  faviconUrl: z.string().url().optional().nullable(),
  // The 'metadata' object from the extension is not saved directly,
  // but could be validated here if needed in the future.
});

// Create a TypeScript type from the Zod schema for type safety (Recommendation #6)
type NewLinkPayload = z.infer<typeof CreateLinkSchema>;

export async function POST(request: NextRequest) {
  console.log("--- CREATE LINK API START ---");
  console.log("Request Headers:", Object.fromEntries(request.headers.entries()));

  // 1. Configuration and Authentication
  const aiEngineUrl = process.env.AI_ENGINE_URL;
  const internalApiKey = process.env.INTERNAL_API_KEY; // For securing inter-service communication
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error("Authentication failed: No user object found.");
    return NextResponse.json({ error: 'You must be logged in to create a link.' }, { status: 401 });
  }
  console.log("Authenticated User ID:", user.id);

  if (!aiEngineUrl || !internalApiKey) {
    console.error("Configuration Error: AI_ENGINE_URL or INTERNAL_API_KEY is not set.");
    return NextResponse.json({ error: "Server is not configured for AI processing." }, { status: 500 });
  }

  // 2. Input Validation (Recommendation #1)
  // We use `safeParse` to provide detailed error messages back to the client.
  const body = await request.json();
  console.log("Request Body:", body);
  const validation = CreateLinkSchema.safeParse(body);

  if (!validation.success) {
    console.error("Validation failed:", validation.error.flatten().fieldErrors);
    return NextResponse.json(
      { error: "Invalid request body", details: validation.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const { url, title, pageContent, excerpt, byline, faviconUrl }: NewLinkPayload = validation.data;

  // 3. Initial, synchronous save to the database
  const { data: newLink, error: insertError } = await supabase
    .from('links')
    .insert({
      user_id: user.id,
      url,
      title,
      favicon_url: faviconUrl, // Assumes DB column is snake_case (Recommendation #2)
      excerpt,
      byline,
      status: 'pending',
    })
    .select()
    .single();

  if (insertError) {
    if (insertError.code === '23505') { // (Recommendation #2)
      return NextResponse.json({ error: 'This link has already been saved.' }, { status: 409 });
    }
    console.error('Error inserting link:', insertError);
    return NextResponse.json({ error: 'Failed to save the new link.' }, { status: 500 });
  }

  // 4. Asynchronously trigger the AI engine
  // This is a "fire-and-forget" call, but we add error logging.
  // A true queueing system would be the next step for production hardening.
  if (pageContent) {
    console.log(`Triggering AI processing for link_id: ${newLink.id}`);
    fetch(`${aiEngineUrl}/api/v1/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${internalApiKey}` // Secure the endpoint (Recommendation #3)
      },
      body: JSON.stringify({
        link_id: newLink.id,
        page_content: pageContent
      }),
    }).catch(error => {
      // Add observability for failed AI triggers (Recommendation #3)
      console.error(`CRITICAL: Failed to trigger AI engine for link_id ${newLink.id}. Link will remain 'pending'. Error:`, error);
    });
  } else {
    console.log(`No content for link_id: ${newLink.id}. Marking as 'completed'.`);
    // Hardened update to prevent cross-user updates (Recommendation #4)
    await supabase.from('links').update({ status: 'completed' }).eq('id', newLink.id).eq('user_id', user.id);
  }

  // 5. Return the newly created link record to the client immediately.
  console.log("--- CREATE LINK API END ---");
  return NextResponse.json(newLink, { status: 201 });
} 