import { useState } from 'react'
import type { FormEvent } from 'react'
import { LockKeyhole } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

export function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY first.')
      return
    }

    setIsLoading(true)
    const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password })

    if (loginError || !data.user) {
      setError('Invalid admin email or password.')
      setIsLoading(false)
      return
    }

    const { data: adminProfile, error: adminError } = await supabase
      .from('admin_profiles')
      .select('id')
      .eq('id', data.user.id)
      .maybeSingle()

    if (adminError || !adminProfile) {
      await supabase.auth.signOut()
      setError('This account is not approved as an admin.')
      setIsLoading(false)
      return
    }

    navigate('/admin/dashboard')
  }

  return (
    <main className="grid min-h-screen place-items-center bg-cream px-4 py-12">
      <section className="w-full max-w-md rounded-lg border border-coffee/10 bg-white/45 p-6 shadow-2xl backdrop-blur">
        <Link to="/" className="mb-8 inline-block text-sm text-ink/58 transition hover:text-ink">
          Back to website
        </Link>
        <div className="mb-6 grid size-12 place-items-center rounded-md bg-taupe/15 text-coffee">
          <LockKeyhole />
        </div>
        <h1 className="font-serif text-4xl text-ink">Admin login</h1>
        <p className="mt-3 leading-7 text-ink/64">
          No admin password is stored in this website. Login uses Supabase Auth, then checks your account against
          the approved admin list.
        </p>
        {!isSupabaseConfigured && (
          <p className="mt-5 rounded-md border border-coffee/15 bg-cream p-3 text-sm text-coffee">
            Supabase is not connected yet, so admin login is intentionally disabled.
          </p>
        )}
        <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
          <label className="form-label">
            Email
            <input className="form-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label className="form-label">
            Password
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error && <p className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={isLoading || !isSupabaseConfigured}
            className="w-full rounded-full bg-coffee px-5 py-3 font-semibold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-55"
          >
            {isLoading ? 'Checking access...' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  )
}
