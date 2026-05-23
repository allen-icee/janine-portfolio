import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { isSupabaseConfigured, supabase } from '../../lib/supabase'

type AdminGuardProps = {
  children: ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const [isAllowed, setIsAllowed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const checkAccess = async () => {
      if (!isSupabaseConfigured || !supabase) {
        setMessage('Supabase is not configured yet. Add your frontend .env values first.')
        setIsLoading(false)
        return
      }

      const { data: sessionData } = await supabase.auth.getSession()
      const user = sessionData.session?.user

      if (!user) {
        setMessage('Please sign in before opening the admin dashboard.')
        setIsLoading(false)
        return
      }

      const { data: adminProfile } = await supabase
        .from('admin_profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle()

      if (!adminProfile) {
        setMessage('This account is not listed in admin_profiles.')
        setIsLoading(false)
        return
      }

      setIsAllowed(true)
      setIsLoading(false)
    }

    void checkAccess()
  }, [])

  if (isLoading) {
    return <main className="grid min-h-screen place-items-center bg-[#f9f6f3] text-[#3c232c]">Checking admin access...</main>
  }

  if (!isAllowed) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f9f6f3] px-4">
        <section className="max-w-md rounded-2xl border border-[#efdad0] bg-white/70 p-6 text-center shadow-xl">
          <h1 className="font-serif text-4xl font-bold text-[#3c232c]">Access required</h1>
          <p className="mt-3 leading-7 text-[#3c232c]/64">{message}</p>
          <Link to="/admin/login" className="mt-6 inline-flex rounded-full bg-[#ad6a6c] px-6 py-3 font-semibold text-white">
            Go to admin login
          </Link>
        </section>
      </main>
    )
  }

  return children
}
