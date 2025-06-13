import { createSupabaseServerClient } from '../../../lib/supabase/server';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { z } from 'zod';

// Schema has been expanded to accept all the rich metadata from the extension.
const CreateLinkSchema = z.object({
  url: z.string().url(),
  title: z.string().max(300),
  pageContent: z.string().optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  author: z.string().max(200).optional().nullable(),
  siteName: z.string().max(200).optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  faviconUrl: z.string().url().optional().nullable(),
  lang: z.string().max(50).optional().nullable(),
});

// Create a TypeScript type from the Zod schema for type safety
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
  // Destructure all the new fields from the validated data.
  const { url, title, pageContent, description, author, siteName, imageUrl, faviconUrl, lang }: NewLinkPayload = validation.data;

  // 3. Initial, synchronous save to the database
  const { data: newLink, error: insertError } = await supabase
    .from('links')
    .insert({
      user_id: user.id,
      url,
      title,
      description,
      author,
      site_name: siteName,
      image_url: imageUrl,
      favicon_url: faviconUrl,
      lang,
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