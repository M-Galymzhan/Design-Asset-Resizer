import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import PaymentClient from './PaymentClient'
import { Wallet } from 'lucide-react'

export default async function PaymentPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  
  // Note: we might need to await params in newer Next.js versions depending on the setup, 
  // but let's assume standard Next 15 Server Component usage here.
  const { id } = await params;

  // Fetch invoice and join with seller profile
  const { data: invoice, error } = await supabase
    .from('invoices')
    .select(`
      *,
      profiles:seller_id (
        full_name,
        kaspi_phone
      )
    `)
    .eq('id', id)
    .single()

  if (error || !invoice || !invoice.profiles) {
    notFound()
  }

  // Type assertion since we know it's a single profile from the join
  const seller = invoice.profiles as unknown as { full_name: string; kaspi_phone: string }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b px-4 py-3 flex justify-center items-center">
        <div className="flex items-center gap-2 text-green-600 font-bold text-xl">
          <Wallet className="w-6 h-6" />
          <span>PayLink.kz</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <div className="p-6 sm:p-8">
            <PaymentClient invoice={invoice} seller={seller} />
          </div>
        </div>
        
        <p className="mt-8 text-sm text-slate-500 flex items-center gap-1">
          Безопасные платежи через Kaspi Gold
        </p>
      </main>
    </div>
  )
}
