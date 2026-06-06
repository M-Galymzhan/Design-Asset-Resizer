import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from './ProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const isProfileIncomplete = !profile?.full_name || !profile?.kaspi_phone

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow sm:rounded-2xl p-6 sm:p-8 border border-slate-100">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            {isProfileIncomplete ? 'Заполните профиль' : 'Настройки профиля'}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {isProfileIncomplete 
              ? 'Эти данные нужны для того, чтобы клиенты могли переводить вам деньги.' 
              : 'Обновите свои данные для приема платежей.'}
          </p>
        </div>

        <ProfileForm initialProfile={profile} />
      </div>
    </div>
  )
}
