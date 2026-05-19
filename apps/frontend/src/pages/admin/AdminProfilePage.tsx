import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Field, SaveButton, TextArea, TextInput } from '../../components/admin/AdminFields'
import { AdminGuard } from '../../components/admin/AdminGuard'
import { AdminShell } from '../../components/admin/AdminShell'
import { profile } from '../../data/site'
import { supabase } from '../../lib/supabase'

type ProfileForm = typeof profile & { headline: string }

export function AdminProfilePage() {
  const [form, setForm] = useState<ProfileForm>({
    ...profile,
    headline: "Plan and grow, I'll run the show.",
  })
  const [status, setStatus] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      const { data } = await supabase
        ?.from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'profile')
        .maybeSingle() ?? {}

      if (data?.setting_value) {
        setForm((current) => ({ ...current, ...data.setting_value }))
      }
    }

    void loadProfile()
  }, [])

  const updateField = (key: keyof ProfileForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('Saving...')

    const { error } = await supabase!
      .from('site_settings')
      .upsert({ setting_key: 'profile', setting_value: form, updated_at: new Date().toISOString() }, { onConflict: 'setting_key' })

    setStatus(error ? error.message : 'Profile saved.')
  }

  return (
    <AdminGuard>
      <AdminShell title="Profile Settings" description="Edit the main public profile text, contact details, and hero headline.">
        <form onSubmit={saveProfile} className="grid gap-5 rounded-lg border border-coffee/10 bg-white/45 p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Name">
              <TextInput value={form.name} onChange={(event) => updateField('name', event.target.value)} />
            </Field>
            <Field label="Title">
              <TextInput value={form.title} onChange={(event) => updateField('title', event.target.value)} />
            </Field>
            <Field label="Headline">
              <TextInput value={form.headline} onChange={(event) => updateField('headline', event.target.value)} />
            </Field>
            <Field label="Availability">
              <TextInput value={form.availability} onChange={(event) => updateField('availability', event.target.value)} />
            </Field>
            <Field label="Email">
              <TextInput value={form.email} onChange={(event) => updateField('email', event.target.value)} />
            </Field>
            <Field label="Secondary Email">
              <TextInput value={form.secondaryEmail ?? ''} onChange={(event) => updateField('secondaryEmail', event.target.value)} />
            </Field>
            <Field label="Phone">
              <TextInput value={form.phone ?? ''} onChange={(event) => updateField('phone', event.target.value)} />
            </Field>
            <Field label="Secondary Phone">
              <TextInput value={form.secondaryPhone ?? ''} onChange={(event) => updateField('secondaryPhone', event.target.value)} />
            </Field>
            <Field label="Location">
              <TextInput value={form.location} onChange={(event) => updateField('location', event.target.value)} />
            </Field>
            <Field label="Hero Image URL">
              <TextInput value={form.heroImageUrl ?? ''} onChange={(event) => updateField('heroImageUrl', event.target.value)} />
            </Field>
            <Field label="About Image URL">
              <TextInput value={form.aboutImageUrl ?? ''} onChange={(event) => updateField('aboutImageUrl', event.target.value)} />
            </Field>
            <Field label="CV URL">
              <TextInput value={form.cvUrl ?? ''} onChange={(event) => updateField('cvUrl', event.target.value)} />
            </Field>
            <Field label="Facebook URL">
              <TextInput value={form.facebookUrl ?? ''} onChange={(event) => updateField('facebookUrl', event.target.value)} />
            </Field>
            <Field label="Instagram URL">
              <TextInput value={form.instagramUrl ?? ''} onChange={(event) => updateField('instagramUrl', event.target.value)} />
            </Field>
            <Field label="LinkedIn URL">
              <TextInput value={form.linkedinUrl ?? ''} onChange={(event) => updateField('linkedinUrl', event.target.value)} />
            </Field>
            <Field label="WhatsApp URL">
              <TextInput value={form.whatsappUrl ?? ''} onChange={(event) => updateField('whatsappUrl', event.target.value)} />
            </Field>
            <Field label="Telegram URL">
              <TextInput value={form.telegramUrl ?? ''} onChange={(event) => updateField('telegramUrl', event.target.value)} />
            </Field>
            <Field label="Messenger URL">
              <TextInput value={form.messengerUrl ?? ''} onChange={(event) => updateField('messengerUrl', event.target.value)} />
            </Field>
          </div>
          <Field label="Tagline">
            <TextArea value={form.tagline} onChange={(event) => updateField('tagline', event.target.value)} />
          </Field>
          <div className="flex items-center gap-4">
            <SaveButton />
            {status && <p className="text-sm text-ink/62">{status}</p>}
          </div>
        </form>
      </AdminShell>
    </AdminGuard>
  )
}
