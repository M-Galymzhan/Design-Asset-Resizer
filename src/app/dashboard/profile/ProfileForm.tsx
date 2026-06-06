'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

type Profile = {
  full_name: string | null
  kaspi_phone: string | null
}

export default function ProfileForm({ initialProfile }: { initialProfile: Profile | null }) {
  const [fullName, setFullName] = useState(initialProfile?.full_name || '')
  const [kaspiPhone, setKaspiPhone] = useState(initialProfile?.kaspi_phone || '')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const router = useRouter()
  const supabase = createClient()

  const formatPhone = (value: string) => {
    // Basic formatting for KZ phone numbers
    const digits = value.replace(/\D/g, '')
    if (digits.startsWith('7') || digits.startsWith('8')) {
      return `+7${digits.substring(1, 11)}`
    }
    return value
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKaspiPhone(formatPhone(e.target.value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('User not found')

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          kaspi_phone: kaspiPhone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error

      setMessage({ type: 'success', text: 'Профиль успешно сохранен!' })
      
      // If it was incomplete before, redirect to dashboard
      if (!initialProfile?.full_name || !initialProfile?.kaspi_phone) {
        router.push('/dashboard')
      } else {
        router.refresh()
      }
    } catch (error: unknown) {
      setMessage({ type: 'error', text: (error instanceof Error ? error.message : 'Ошибка при сохранении.') })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium leading-6 text-slate-900">
          Ваше Имя и Фамилия
        </label>
        <div className="mt-2">
          <input
            type="text"
            id="fullName"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
            placeholder="Иван Иванов"
          />
        </div>
        <p className="mt-1 text-xs text-slate-500">Как указано в Kaspi, чтобы клиенты могли проверить кому переводят.</p>
      </div>

      <div>
        <label htmlFor="kaspiPhone" className="block text-sm font-medium leading-6 text-slate-900">
          Номер телефона Kaspi Gold
        </label>
        <div className="mt-2">
          <input
            type="tel"
            id="kaspiPhone"
            required
            value={kaspiPhone}
            onChange={handlePhoneChange}
            className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
            placeholder="+77001234567"
          />
        </div>
      </div>

      {message && (
        <div className={`rounded-md p-4 ${message.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {message.type === 'success' 
                ? <CheckCircle2 className="h-5 w-5 text-green-400" aria-hidden="true" />
                : <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
              }
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {message.text}
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full justify-center rounded-xl bg-green-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Сохранение...' : 'Сохранить и продолжить'}
        </button>
      </div>
    </form>
  )
}
