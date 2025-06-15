
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

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
    const { name, email } = await req.json()
    console.log(`New subscription: ${name} <${email}>.`);

    const apiKey = Deno.env.get('MAILRELAY_API_KEY')
    const hostname = Deno.env.get('MAILRELAY_ACCOUNT_HOSTNAME')
    const groupId = Deno.env.get('MAILRELAY_GROUP_ID')

    if (!apiKey || !hostname) {
      throw new Error('MailRelay API key or hostname not configured.')
    }
    
    if (!groupId) {
      throw new Error('MailRelay Group ID not configured.')
    }

    // Clean up hostname to ensure we only have the account part
    const account = hostname
      .replace(/^https?:\/\//, '') // remove protocol
      .replace(/\.ipzmarketing\.com/, '') // remove domain part
      .replace(/\/$/, ''); // remove trailing slash

    const apiUrl = `https://${account}.ipzmarketing.com/api/v1/subscribers`;
    console.log('Attempting to call MailRelay API at:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': apiKey,
      },
      body: JSON.stringify({
        email: email,
        name: name,
        group_ids: [parseInt(groupId, 10)],
        status: "pending", // Usar pending para activar doble opt-in
        send_confirmation_email: true // Asegurar que se envía el email de confirmación
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('MailRelay API Error:', errorData)
      throw new Error(`Failed to add subscriber: ${errorData.error.message || response.statusText}`)
    }

    const data = await response.json()
    console.log('MailRelay response:', data);

    // Si el contacto ya existía y queremos forzar el reenvío del email de confirmación
    if (data.id) {
      console.log(`Subscriber created/updated with ID: ${data.id}. Sending confirmation email.`);
      
      const confirmationUrl = `https://${account}.ipzmarketing.com/api/v1/confirmation_emails`;
      
      const confirmationResponse = await fetch(confirmationUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': apiKey,
        },
        body: JSON.stringify({
          subscriber_id: data.id
        }),
      });

      if (confirmationResponse.ok) {
        console.log('Confirmation email sent successfully');
      } else {
        console.log('Note: Could not force confirmation email resend, but initial creation was successful');
      }
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error in mailrelay-contact function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
