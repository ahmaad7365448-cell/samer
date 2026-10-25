'use server'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL!

export async function submitProject(formData: FormData) {
  const client_name = formData.get('client_name') as string
  const phone = formData.get('phone') as string
  const project_idea = formData.get('project_idea') as string

  if (!client_name || !phone || !project_idea) {
    return { error: 'جميع الحقول مطلوبة' }
  }

  const payload = { client_name, phone, project_idea }

  try {
    const [supabaseResult, n8nResult] = await Promise.all([
      supabase.from('project_requests').insert([payload]),
      fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
    ])

    if (supabaseResult.error) throw supabaseResult.error

    return { success: true }
  } catch (error) {
    console.error('Error:', error)
    return { error: 'حدث خطأ أثناء معالجة طلبك.' }
  }
}