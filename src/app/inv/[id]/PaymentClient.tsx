'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle2, Copy, AlertCircle, ArrowRight } from 'lucide-react'
import type { Database } from '@/types/supabase'

type Invoice = Database['public']['Tables']['invoices']['Row']
type Seller = { full_name: string; kaspi_phone: string }

export default function PaymentClient({ invoice, seller }: { invoice: Invoice, seller: Seller }) {
  const [payerName, setPayerName] = useState('')
  const [loading, setLoading] = useState(false)
  const [isPaidLocally, setIsPaidLocally] = useState(invoice.status === 'paid')
  const [message, setMessage] = useState<{ type: 'error', text: string } | null>(null)
  
  const supabase = createClient()

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(seller.kaspi_phone)
      alert('Номер скопирован!')
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handlePayClick = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!payerName.trim()) {
      setMessage({ type: 'error', text: 'Пожалуйста, введите ваше имя.' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('invoices')
        .update({ 
          status: 'paid',
          payer_name: payerName.trim(),
          paid_at: new Date().toISOString()
        })
        .eq('id', invoice.id)

      if (error) throw error

      setIsPaidLocally(true)
    } catch (error) {
      console.error('Error updating invoice:', error)
      setMessage({ type: 'error', text: 'Произошла ошибка. Попробуйте еще раз.' })
    } finally {
      setLoading(false)
    }
  }

  if (isPaidLocally || invoice.status === 'paid') {
    return (
      <div className="text-center py-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Оплачено</h2>
        <p className="text-slate-600">Продавец получил уведомление об оплате.</p>
        <p className="text-slate-600 mt-1">Спасибо!</p>
      </div>
    )
  }

  if (invoice.status === 'cancelled') {
    return (
      <div className="text-center py-6">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Счет отменен</h2>
        <p className="text-slate-600">Данный счет больше недействителен.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="text-center mb-8">
        <p className="text-slate-500 mb-1">Сумма к оплате</p>
        <div className="text-4xl font-extrabold text-slate-900 mb-2">
          {invoice.amount.toLocaleString('ru-RU')} ₸
        </div>
        <p className="text-sm font-medium text-slate-700 bg-slate-100 py-2 px-4 rounded-full inline-block max-w-full truncate">
          {invoice.description}
        </p>
      </div>

      <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 mb-8 border border-slate-100">
        <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider text-center">
          Реквизиты Kaspi
        </h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-xs text-slate-500 mb-1">Получатель</p>
            <p className="font-medium text-slate-900">{seller.full_name}</p>
          </div>
          
          <div>
            <p className="text-xs text-slate-500 mb-1">Номер телефона</p>
            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-3">
              <span className="font-mono text-lg text-slate-900">{seller.kaspi_phone}</span>
              <button 
                onClick={copyPhone}
                className="text-green-600 hover:text-green-700 flex items-center gap-1 text-sm font-medium"
              >
                <Copy className="w-4 h-4" /> Копировать
              </button>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handlePayClick} className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 mb-4 text-sm text-yellow-800 text-center">
          <strong>Шаг 1:</strong> Переведите сумму на Kaspi по номеру выше.<br/>
          <strong>Шаг 2:</strong> Введите ваше имя и нажмите кнопку ниже.
        </div>

        <div>
          <label htmlFor="payerName" className="block text-sm font-medium text-slate-700 mb-1">
            Ваше имя (как в Kaspi)
          </label>
          <input
            type="text"
            id="payerName"
            required
            value={payerName}
            onChange={(e) => setPayerName(e.target.value)}
            className="block w-full rounded-xl border-slate-300 py-3 px-4 text-slate-900 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm bg-slate-50 border"
            placeholder="Иван И."
          />
        </div>

        {message && (
          <p className="text-red-600 text-sm">{message.text}</p>
        )}

        <button
          type="submit"
          disabled={loading || !payerName.trim()}
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white text-lg font-semibold px-6 py-4 rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 disabled:opacity-50"
        >
          {loading ? 'Отправка...' : 'Я перевел деньги'}
          {!loading && <ArrowRight className="w-5 h-5" />}
        </button>
      </form>
    </div>
  )
}
