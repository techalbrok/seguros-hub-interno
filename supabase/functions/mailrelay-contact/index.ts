
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
    console.log(`New subscription request:`, { name, email })

    const apiKey = Deno.env.get('MAILRELAY_API_KEY') || null
    const hostnameRaw = Deno.env.get('MAILRELAY_ACCOUNT_HOSTNAME') || ''
    const groupIdRaw = Deno.env.get('MAILRELAY_GROUP_ID') || ''

    // Mostrar los secretos usados
    console.log('MailRelay params loaded:', {
      apiKeyPresent: !!apiKey,
      hostnameRaw,
      groupIdRaw,
    })

    if (!apiKey || !hostnameRaw || !groupIdRaw) {
      return new Response(
        JSON.stringify({ error: 'MailRelay API key, hostname o group ID no está configurado.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Sanitizamos el hostname: solo subdominio
    let account = hostnameRaw
      .trim()
      .replace(/^https?:\/\//, "")
      .replace(/\.ipzmarketing\.com.*/i, "")
      .replace(/[\/\s]+$/, "");

    // En caso de que el usuario meta directamente el subdominio
    if (account.includes(".")) {
      account = account.split(".")[0]
    }
    // reconstruct hostname
    const cleanHostname = `${account}.ipzmarketing.com`
    console.log("Hostname limpio para MailRelay:", cleanHostname)
    
    // Validamos y convertimos a entero el groupId
    const groupId = Number(String(groupIdRaw).trim())
    if (isNaN(groupId)) {
      return new Response(
        JSON.stringify({ error: 'MAILRELAY_GROUP_ID debe ser un número entero válido.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
    // Solo dejamos el correo/limpio
    const apiUrl = `https://${cleanHostname}/api/v1/subscribers`
    const confirmationUrl = `https://${cleanHostname}/api/v1/confirmation_emails`

    const subscriberPayload = {
      email: String(email || '').trim().toLowerCase(),
      name: String(name || '').trim(),
      group_ids: [groupId],
      status: "pending",
      send_confirmation_email: true,
    }
    console.log('Payload para MailRelay:', JSON.stringify(subscriberPayload, null, 2))

    // --- PRIMERA LLAMADA: crear/actualizar suscriptor ---
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': apiKey,
      },
      body: JSON.stringify(subscriberPayload),
    });

    let data: any = null
    let errorDetails: any = null
    let rawResponse: string | null = null

    try {
      data = await response.clone().json()
    } catch (err) {
      try {
        rawResponse = await response.clone().text()
      } catch {
        rawResponse = "(no response text)"
      }
      errorDetails = { raw: rawResponse }
    }

    // Loggar TODO sobre la respuesta de mailrelay directamente
    console.log("API MailRelay status:", response.status, "data:", JSON.stringify(data), "raw:", rawResponse)

    if (!response.ok || (data && data.errors)) {
      let errorMessage = 'Error desconocido en MailRelay'
      if (data && data.errors) {
        errorMessage = JSON.stringify(data.errors)
      }
      console.error('MailRelay API Error:', errorMessage)
      return new Response(
        JSON.stringify({ error: errorMessage, details: data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Si devolvió un id de suscriptor, forzamos reenvío de confirmación
    if (data && data.id) {
      console.log("Intentando forzar envío re-confirmación con id:", data.id)
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
          console.log('Reenvío de confirmación OK')
        } else {
          const confirmationError = await confirmationResponse.text()
          console.error('Error en reenvío de confirmación:', confirmationError)
        }
      } catch (e) {
        console.error('Excepción intentando reenviar confirmación:', e)
      }
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error en mailrelay-contact function:', error)
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
