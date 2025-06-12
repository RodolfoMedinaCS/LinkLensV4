import { createSupabaseServerClient } from '../../../lib/supabase/server';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { z } from 'zod';

// Define the schema for input validation
// Define the schema for input validation
const CreateLinkSchema = z.object({
  url: z.string().url({ message: "Invalid URL provided" }),
  title: z.string(),
  faviconUrl: z.string().optional(), // This allows any string for the favicon
  pageContent: z.string().optional(),
});

export async function POST(request: NextRequest) {
  // --- DIAGNOSTIC LOGGING ---
  const requestBody = await request.clone().json().catch(() => ({}));
  console.log("Received request body for validation:", JSON.stringify(requestBody, null, 2));
  // --------------------------

  // 1. Configuration Validation
  const aiEngineUrl = process.env.AI_ENGINE_URL;
  if (!aiEngineUrl) {
    console.error("Configuration error: AI_ENGINE_URL is not set.");
    return NextResponse.json(
      { error: "Server configuration error. Please contact support." },
      { status: 500 }
    );
  }

  // 2. Authentication
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // 3. Input Validation
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const validation = CreateLinkSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid request body", details: validation.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const { url, title, faviconUrl, pageContent } = validation.data;

  // 4. Core Logic: Insert high-quality data from the extension
  const { data: newLink, error: insertError } = await supabase
    .from('links')
    .insert({
      url,
      user_id: user.id,
      status: 'pending',
      title: title, // Use the accurate title from the extension
      favicon_url: faviconUrl, // Use the accurate favicon from the extension
    })
    .select()
    .single();

  if (insertError) {
    if (insertError.code === '23505') {
      return NextResponse.json({ error: 'Link already exists for this user' }, { status: 409 });
    }
    console.error('Error inserting link:', insertError);
    return NextResponse.json({ error: 'Failed to create new link record' }, { status: 500 });
  }

  // 5. Asynchronously trigger the AI engine (fire-and-forget)
  // We only send the content and ID, as the AI engine is now a specialist.
  if (pageContent) {
    (async () => {
      try {
        await fetch(`${aiEngineUrl}/process`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            link_id: newLink.id,
            page_content: pageContent
          }),
        });
      } catch (error) {
        console.error(`Failed to trigger AI engine for link_id ${newLink.id}:`, error);
        await supabase.from('links').update({ status: 'failed' }).eq('id', newLink.id);
      }
    })();
  } else {
    // If no page content is provided, just mark as processed.
    console.log(`Link ${newLink.id} created without page content. Skipping AI processing.`);
    await supabase.from('links').update({ status: 'processed', ai_summary: 'No content provided for summary.' }).eq('id', newLink.id);
  }

  // 6. Return success response
  return NextResponse.json({
    success: true,
    message: 'Link capture initiated. Processing will complete in the background.',
    data: newLink,
  });
} 