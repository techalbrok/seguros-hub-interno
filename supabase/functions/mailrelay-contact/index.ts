
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
    console.log(`New subscription request: ${name} <${email}>`)

    const apiKey = Deno.env.get('MAILRELAY_API_KEY')
    const hostname = Deno.env.get('MAILRELAY_ACCOUNT_HOSTNAME')
    const groupId = Deno.env.get('MAILRELAY_GROUP_ID')

    // LOG PARAMS (evita exponerlos en producción/real)
    console.log('MailRelay params:', {
      apiKeyLoaded: !!apiKey ? 'Present' : 'Missing',
      hostname,
      groupId,
    })

    if (!apiKey || !hostname) {
      return new Response(
        JSON.stringify({ error: 'MailRelay API key or hostname not configured.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
    
    if (!groupId) {
      return new Response(
        JSON.stringify({ error: 'MailRelay Group ID not configured.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Clean hostname, solo la cuenta
    const account = hostname
      .replace(/^https?:\/\//, '')
      .replace(/\.ipzmarketing\.com/, '')
      .replace(/\/$/, '');

    const apiUrl = `https://${account}.ipzmarketing.com/api/v1/subscribers`;
    const confirmationUrl = `https://${account}.ipzmarketing.com/api/v1/confirmation_emails`;

    const subscriberPayload = {
      email,
      name,
      group_ids: [parseInt(groupId, 10)],
      status: "pending",
      send_confirmation_email: true,
    }
    console.log('MailRelay to:', apiUrl)
    console.log('Payload:', subscriberPayload)

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': apiKey,
      },
      body: JSON.stringify(subscriberPayload),
    })

    let data: any = null
    let errorDetails: any = null

    try {
      data = await response.json()
    } catch (err) {
      errorDetails = { raw: await response.text() }
    }

    if (!response.ok || (data && data.errors)) {
      console.error('MailRelay API Error:', data || errorDetails)
      let errorMessage = 'Error desconocido en MailRelay'
      if (data && data.errors) {
        errorMessage = JSON.stringify(data.errors)
      }
      return new Response(
        JSON.stringify({ error: errorMessage }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Si hay un id de suscriptor, forzar el reenvío del email de confirmación
    if (data && data.id) {
      console.log(`Subscriber ID: ${data.id}, trying to send confirmation email again.`)
      try {
        const confirmationResponse = await fetch(confirmationUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': apiKey,
          },
          body: JSON.stringify({ subscriber_id: data.id }),
        });
        if (confirmationResponse.ok) {
          console.log('Confirmation email sent successfully')
        } else {
          const confirmationError = await confirmationResponse.text()
          console.log('Could not force confirmation email resend:', confirmationError)
        }
      } catch (e) {
        console.log('Exception trying to resend confirmation email:', e)
      }
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error in mailrelay-contact function:', error)
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
