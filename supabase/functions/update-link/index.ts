import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

console.log("Update Link function script started");

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { link_id, payload } = await req.json();

    if (!link_id || !payload) {
      throw new Error("Missing link_id or payload in request body.");
    }

    // Create a Supabase client with the user's authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
        throw new Error("Missing Authorization header.");
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );
    
    // Update the link record
    const { data, error } = await supabaseClient
      .from('links')
      .update(payload)
      .eq('id', link_id)
      .select()
      .single();

    if (error) {
      console.error(`Supabase error for link_id ${link_id}:`, error);
      throw error;
    }

    console.log(`Successfully updated link_id: ${link_id}`, data);

    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    console.error("Error in function:", err);
    return new Response(String(err?.message ?? err), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
}); 