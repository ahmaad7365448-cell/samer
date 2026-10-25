'use server'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function submitProject(formData: FormData) {
  const client_name = formData.get('client_name') as string
  const phone = formData.get('phone') as string
  const project_idea = formData.get('project_idea') as string

  if (!client_name || !phone || !project_idea) {
    return { error: 'جميع الحقول مطلوبة' }
  }

  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
  if (!n8nWebhookUrl) {
    return { error: 'خطأ: رابط N8N غير موجود في Vercel' }
  }

  const payload = { client_name, phone, project_idea }

  try {
    const [supabaseResult, n8nResult] = await Promise.all([
      supabase.from('project_requests').insert([payload]),
      fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true' 
        },
        body: JSON.stringify(payload)
      })
    ])

    if (supabaseResult.error) {
        throw new Error(`خطأ قاعدة البيانات: ${supabaseResult.error.message}`)
    }

    if (!n8nResult.ok) {
        throw new Error(`خطأ N8N: السيرفر رفض الطلب بحالة ${n8nResult.status}`)
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error:', error)
    return { error: `تفاصيل الخطأ: ${error.message}` }
  }
}