'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PlusCircle, X } from 'lucide-react'

export default function CreateInvoiceModal({ sellerId }: { sellerId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert({
          seller_id: sellerId,
          amount: parseFloat(amount),
          description,
        })
        .select()
        .single()

      if (error) throw error

      setIsOpen(false)
      setAmount('')
      setDescription('')
      router.refresh() // Refresh the page to show the new invoice
    } catch (error) {
      console.error('Error creating invoice:', error)
      alert('Ошибка при создании счета.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors font-medium text-sm w-full sm:w-auto justify-center"
      >
        <PlusCircle className="w-5 h-5" />
        Создать счет
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-slate-900">Новый счет</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">
                  Сумма (₸)
                </label>
                <input
                  type="number"
                  id="amount"
                  required
                  min="1"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="block w-full rounded-xl border-slate-300 py-3 px-4 text-slate-900 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm bg-slate-50 border"
                  placeholder="5000"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                  За что оплата
                </label>
                <input
                  type="text"
                  id="description"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="block w-full rounded-xl border-slate-300 py-3 px-4 text-slate-900 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm bg-slate-50 border"
                  placeholder="Маникюр с покрытием"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 rounded-xl bg-white px-3 py-3 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl bg-green-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Создание...' : 'Создать ссылку'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
