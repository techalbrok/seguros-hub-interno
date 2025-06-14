
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { name, email, password, role, delegationId, permissions, isFirstUser } = await req.json()

    console.log('Creating user with service role key:', { name, email, role, isFirstUser })

    // If this is not the first user, check authentication
    if (!isFirstUser) {
      const authHeader = req.headers.get('Authorization')
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: 'No authorization header provided' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const token = authHeader.replace('Bearer ', '')
      const { data, error: userError } = await supabaseClient.auth.getUser(token)
      const user = data.user

      if (userError || !user) {
        console.error('Auth error:', userError)
        return new Response(
          JSON.stringify({ error: 'Invalid authentication token' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Check if the current user is admin
      const { data: userRole } = await supabaseClient
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      if (!userRole || userRole.role !== 'admin') {
        return new Response(
          JSON.stringify({ error: 'Unauthorized: Admin access required' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Create user in auth with service role key
    const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true
    })

    if (authError) {
      console.error('Auth error during user creation:', authError)
      return new Response(
        JSON.stringify({ error: authError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!authData.user) {
      return new Response(
        JSON.stringify({ error: 'No user returned from creation' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('User created in auth, ID:', authData.user.id)

    // Wait a moment for the trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update profile with delegation if provided
    if (delegationId) {
      console.log('Updating profile with delegation:', delegationId)
      const { error: profileError } = await supabaseClient
        .from('profiles')
        .update({ delegation_id: delegationId })
        .eq('id', authData.user.id)

      if (profileError) {
        console.error('Error updating profile:', profileError)
        return new Response(
          JSON.stringify({ error: 'Error updating profile: ' + profileError.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Create user role
    console.log('Creating user role:', role)
    const { error: roleError } = await supabaseClient
      .from('user_roles')
      .insert({
        user_id: authData.user.id,
        role: role,
      })

    if (roleError) {
      console.error('Error creating user role:', roleError)
      return new Response(
        JSON.stringify({ error: 'Error creating user role: ' + roleError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create user permissions for each section
    const permissionsToInsert = Object.entries(permissions).map(([section, perms]: [string, any]) => ({
      user_id: authData.user.id,
      section,
      can_create: perms.canCreate,
      can_edit: perms.canEdit,
      can_delete: perms.canDelete,
      can_view: perms.canView,
    }))

    console.log('Creating user permissions:', permissionsToInsert)
    const { error: permissionsError } = await supabaseClient
      .from('user_permissions')
      .insert(permissionsToInsert)

    if (permissionsError) {
      console.error('Error creating user permissions:', permissionsError)
      return new Response(
        JSON.stringify({ error: 'Error creating user permissions: ' + permissionsError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, user: authData.user }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in create-user function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
