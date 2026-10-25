'use client'

import { useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { submitProject } from '@/actions/submitProject'
import { Cairo } from 'next/font/google'

const cairo = Cairo({ subsets: ['arabic'], weight: ['400', '500', '600', '700', '800'] })

const suggestedIdeas = [
  "تطبيق لحجز مواعيد العيادات مع نظام إشعارات ذكي عبر واتساب.",
  "منصة تجارة إلكترونية لبيع الأثاث المخصص مع لوحة تحكم للإدارة.",
  "نظام إدارة مخزون يعتمد على الذكاء الاصطناعي للتنبؤ بنقص المنتجات.",
  "بوت تيليجرام لخدمة العملاء يجيب على الأسئلة الشائعة."
]

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-900/50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
    >
      {pending ? (
        <>
          <span className="animate-spin h-5 w-5 border-2 border-indigo-300 border-t-white rounded-full"></span>
          جاري المعالجة...
        </>
      ) : (
        'إرسال المشروع للتحليل'
      )}
    </button>
  )
}

export default function Home() {
  const formRef = useRef<HTMLFormElement>(null)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [ideaText, setIdeaText] = useState('')

  async function action(formData: FormData) {
    setMessage(null)
    const result = await submitProject(formData)
    
    if (result.error) {
      setMessage({ text: result.error, type: 'error' })
    } else {
      setMessage({ text: 'تم الإرسال بنجاح! سيصلك التقرير على تيليجرام.', type: 'success' })
      formRef.current?.reset()
      setIdeaText('')
    }
  }

  return (
    <main dir="rtl" className={`min-h-screen bg-slate-950 flex items-center justify-center p-4 md:p-8 ${cairo.className}`}>
      <div className="bg-slate-900 p-8 sm:p-10 rounded-2xl shadow-2xl shadow-black/50 border border-slate-800 w-full max-w-xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
            محلل مشاريع الذكاء الاصطناعي
          </h1>
          <p className="text-slate-400 font-medium text-sm sm:text-base">
            أدخل تفاصيل مشروعك للحصول على تقدير فوري وموثوق.
          </p>
        </div>
        
        <form ref={formRef} action={action} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">الاسم</label>
            <input 
              name="client_name" 
              type="text" 
              required 
              className="w-full border border-slate-700 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-950/50 focus:bg-slate-900 text-slate-100 placeholder-slate-600 font-medium" 
              placeholder="اسمك الكريم..."
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">رقم الهاتف</label>
            <input 
              name="phone" 
              type="tel" 
              required 
              className="w-full border border-slate-700 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-950/50 focus:bg-slate-900 text-left dir-ltr text-slate-100 placeholder-slate-600 font-medium" 
              placeholder="+90 5XX XXX XX XX"
            />
          </div>
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
              <label className="block text-sm font-bold text-slate-300">فكرة المشروع</label>
              <span className="text-xs text-indigo-300 font-medium bg-indigo-900/30 px-2 py-1 rounded-md border border-indigo-800/50">
                اختر فكرة جاهزة للبدء 👇
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {suggestedIdeas.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setIdeaText(suggestion)}
                  className="text-xs sm:text-sm bg-slate-800 border border-slate-700 text-slate-300 hover:border-indigo-500 hover:text-white hover:bg-slate-700 px-3 py-2 rounded-lg transition-all text-right font-medium shadow-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <textarea 
              name="project_idea" 
              required 
              rows={5} 
              value={ideaText}
              onChange={(e) => setIdeaText(e.target.value)}
              className="w-full border border-slate-700 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-950/50 focus:bg-slate-900 resize-none text-slate-100 placeholder-slate-600 leading-relaxed font-medium" 
              placeholder="صف فكرة التطبيق أو الموقع الذي ترغب بإنشائه بالتفصيل..."
            ></textarea>
          </div>
          
          {message && (
            <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800' : 'bg-rose-900/30 text-rose-400 border border-rose-800'}`}>
              {message.text}
            </div>
          )}

          <div className="pt-4">
            <SubmitButton />
          </div>
        </form>
      </div>
    </main>
  )
}