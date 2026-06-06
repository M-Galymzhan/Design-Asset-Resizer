'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Wallet, Mail, AlertCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const supabase = createClient()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })

      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({ 
          type: 'success', 
          text: 'Ссылка для входа отправлена! Проверьте вашу почту (и папку Спам).' 
        })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Произошла непредвиденная ошибка.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-2 text-green-600 font-bold text-2xl">
            <Wallet className="w-8 h-8" />
            PayLink.kz
          </Link>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-900">
          Вход в личный кабинет
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Мы используем вход по ссылке без пароля (Magic Link) для вашей безопасности.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-900">
                Email адрес
              </label>
              <div className="mt-2 relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border-0 py-3 pl-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  placeholder="name@example.com"
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
                {loading ? 'Отправка...' : 'Получить ссылку для входа'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
