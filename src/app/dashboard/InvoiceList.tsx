'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { CheckCircle2, Clock, XCircle, Share2, Copy } from 'lucide-react'
import type { Database } from '@/types/supabase'

type Invoice = Database['public']['Tables']['invoices']['Row']

export default function InvoiceList({ initialInvoices }: { initialInvoices: Invoice[] }) {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices)

  const copyToClipboard = async (id: string) => {
    const url = `${window.location.origin}/inv/${id}`
    try {
      await navigator.clipboard.writeText(url)
      alert('Ссылка скопирована!')
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const shareToWhatsApp = (invoice: Invoice) => {
    const url = `${window.location.origin}/inv/${invoice.id}`
    const text = encodeURIComponent(`Здравствуйте! Ссылка на оплату (${invoice.amount} ₸) за: ${invoice.description}. Оплатить можно здесь: ${url}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-sm text-slate-500">У вас пока нет созданных счетов.</p>
        <p className="text-sm text-slate-500 mt-1">Нажмите &quot;Создать счет&quot; чтобы начать.</p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-slate-100">
      {invoices.map((invoice) => (
        <li key={invoice.id} className="p-4 sm:p-6 hover:bg-slate-50 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-lg font-semibold text-slate-900">{invoice.amount.toLocaleString('ru-RU')} ₸</span>
                {invoice.status === 'pending' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                    <Clock className="w-3 h-3" /> Ожидает
                  </span>
                )}
                {invoice.status === 'paid' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    <CheckCircle2 className="w-3 h-3" /> Оплачено
                  </span>
                )}
                {invoice.status === 'cancelled' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                    <XCircle className="w-3 h-3" /> Отменено
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 font-medium mb-1">{invoice.description}</p>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>{format(new Date(invoice.created_at), 'd MMMM yyyy, HH:mm', { locale: ru })}</span>
                {invoice.payer_name && (
                  <>
                    <span>•</span>
                    <span>От: {invoice.payer_name} {invoice.payer_phone}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
               <button
                onClick={() => copyToClipboard(invoice.id)}
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                title="Копировать ссылку"
               >
                 <Copy className="w-4 h-4" />
               </button>
               <button
                onClick={() => shareToWhatsApp(invoice)}
                className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors border border-green-200 text-sm font-medium"
               >
                 <Share2 className="w-4 h-4" />
                 <span className="hidden sm:inline">В WhatsApp</span>
               </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
