import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import InvoiceList from './InvoiceList'
import CreateInvoiceModal from './CreateInvoiceModal'
import { PlusCircle } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Double check profile is complete (layout handles it, but good to be safe)
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, kaspi_phone')
    .eq('id', user.id)
    .single()

  if (!profile?.full_name || !profile?.kaspi_phone) {
    redirect('/dashboard/profile')
  }

  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Мои счета</h1>
          <p className="text-sm text-slate-600 mt-1">Создавайте новые ссылки и отслеживайте оплаты.</p>
        </div>
        
        <CreateInvoiceModal sellerId={user.id} />
      </div>

      <div className="bg-white shadow sm:rounded-2xl border border-slate-100 overflow-hidden">
        <InvoiceList initialInvoices={invoices || []} />
      </div>
    </div>
  )
}
