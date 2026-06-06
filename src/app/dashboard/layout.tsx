import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Wallet, LogOut, User, FileText } from 'lucide-react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  // Check if profile is complete
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, kaspi_phone')
    .eq('id', user.id)
    .single()

  const isProfileIncomplete = !profile?.full_name || !profile?.kaspi_phone

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b px-4 py-3 sticky top-0 z-20 flex justify-between items-center">
        <Link href="/dashboard" className="flex items-center gap-2 text-green-600 font-bold text-xl">
          <Wallet className="w-6 h-6" />
          <span className="hidden sm:inline">PayLink.kz</span>
        </Link>
        
        <nav className="flex items-center gap-4">
          {!isProfileIncomplete && (
            <Link 
              href="/dashboard" 
              className="text-slate-600 hover:text-slate-900 flex items-center gap-1 text-sm font-medium"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Счета</span>
            </Link>
          )}
          <Link 
            href="/dashboard/profile" 
            className="text-slate-600 hover:text-slate-900 flex items-center gap-1 text-sm font-medium"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Профиль</span>
          </Link>
          <form action="/auth/signout" method="post">
            <button className="text-slate-600 hover:text-red-600 flex items-center gap-1 text-sm font-medium transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Выйти</span>
            </button>
          </form>
        </nav>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}
