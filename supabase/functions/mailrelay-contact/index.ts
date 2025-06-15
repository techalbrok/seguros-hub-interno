
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
    const { name, email, message } = await req.json()
    console.log(`New contact form submission: ${name} <${email}>. Message: ${message}`);

    const apiKey = Deno.env.get('MAILRELAY_API_KEY')
    const hostname = Deno.env.get('MAILRELAY_ACCOUNT_HOSTNAME')

    if (!apiKey || !hostname) {
      throw new Error('MailRelay API key or hostname not configured.')
    }

    const response = await fetch(`https://${hostname}.ipzmarketing.com/api/v1/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': apiKey,
      },
      body: JSON.stringify({
        email: email,
        name: name,
        // The message is logged, but not sent to MailRelay as there's no standard field for it.
        // Custom fields would be needed for this.
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('MailRelay API Error:', errorData)
      throw new Error(`Failed to add subscriber: ${errorData.error.message || response.statusText}`)
    }

    const data = await response.json()

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
