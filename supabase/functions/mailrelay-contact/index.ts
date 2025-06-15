
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

    // Mostrar los secretos usados y loggear si falta alguno
    const missingSecrets = []
    if (!apiKey) missingSecrets.push("MAILRELAY_API_KEY")
    if (!hostnameRaw) missingSecrets.push("MAILRELAY_ACCOUNT_HOSTNAME")
    if (!groupIdRaw) missingSecrets.push("MAILRELAY_GROUP_ID")
    if (missingSecrets.length) {
      console.error('Faltan secrets necesarios:', missingSecrets)
      return new Response(
        JSON.stringify({ error: `Faltan secrets: ${missingSecrets.join(', ')}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
    console.log('MailRelay params loaded:', {
      apiKeyPresent: !!apiKey,
      hostnameRaw,
      groupIdRaw,
    })

    // Sanitizar subdominio:
    let account = hostnameRaw
      .replace(/^https?:\/\//, "")
      .replace(/\.ipzmarketing\.com.*/i, "")
      .replace(/[\/\s]+$/, "")
    if (account.includes(".")) account = account.split(".")[0]
    const cleanHostname = `${account}.ipzmarketing.com`
    const apiUrl = `https://${cleanHostname}/api/v1/subscribers`
    const confirmationUrl = `https://${cleanHostname}/api/v1/confirmation_emails`
    console.log("Hostname limpio para MailRelay:", cleanHostname)
    
    // Group id seguro (int)
    const groupId = parseInt(String(groupIdRaw).trim(), 10)
    if (isNaN(groupId)) {
      return new Response(
        JSON.stringify({ error: 'MAILRELAY_GROUP_ID debe ser un número entero válido.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Validar email y nombre
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Email es obligatorio y debe ser válido.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return new Response(
        JSON.stringify({ error: 'El nombre es obligatorio y debe tener al menos 2 caracteres.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Payload estricto según MailRelay (no campos extra)
    const subscriberPayload = {
      email: email.trim().toLowerCase(),
      name: name.trim(),
      group_ids: [groupId], // array de int
      status: "pending",
      send_confirmation_email: true,
    }
    console.log('Payload para MailRelay (POST /api/v1/subscribers):', subscriberPayload)

    // --- LLAMADA PRINCIPAL ---
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': apiKey,
      },
      body: JSON.stringify(subscriberPayload),
    });

    const responseText = await response.text()
    let data: any = null
    try {
      data = JSON.parse(responseText)
    } catch {
      data = null
    }

    // Log completo del response, statusCode y body
    console.log("API MailRelay status:", response.status, "body:", responseText)

    if (!response.ok || (data && data.errors)) {
      let errorMessage = 'Error desconocido en MailRelay'
      if (data && data.errors) errorMessage = JSON.stringify(data.errors)
      console.error('MailRelay API Error:', errorMessage)

      return new Response(
        JSON.stringify({ error: errorMessage, details: data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Si devolvió un id de suscriptor, reenvío forzado de confirmación
    if (data && typeof data.id !== "undefined") {
      console.log("Intentando reenvío de confirmación con id:", data.id)
      try {
        const confirmationResponse = await fetch(confirmationUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': apiKey,
          },
          body: JSON.stringify({ subscriber_id: data.id }),
        });
        const bodyConfirm = await confirmationResponse.text()
        if (confirmationResponse.ok) {
          console.log('Reenvío de confirmación OK', bodyConfirm)
        } else {
          console.error('Error en reenvío confirmación:', bodyConfirm)
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
