import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { DeleteButton, Field, SaveButton, TextArea, TextInput } from '../../components/admin/AdminFields'
import { AdminGuard } from '../../components/admin/AdminGuard'
import { AdminShell } from '../../components/admin/AdminShell'
import { supabase } from '../../lib/supabase'
import type { ClientRecord, FinancialRecord } from '../../types/content'

const emptyRecord: FinancialRecord = {
  client_id: null,
  record_type: 'income',
  description: '',
  amount: 0,
  currency: 'PHP',
  payment_status: 'paid',
  record_date: new Date().toISOString().slice(0, 10),
  notes: '',
}

export function AdminFinancePage() {
  const [records, setRecords] = useState<FinancialRecord[]>([])
  const [clients, setClients] = useState<ClientRecord[]>([])
  const [form, setForm] = useState<FinancialRecord>(emptyRecord)
  const [status, setStatus] = useState('')

  const totalIncome = useMemo(
    () => records.filter((record) => record.record_type === 'income').reduce((sum, record) => sum + Number(record.amount), 0),
    [records],
  )
  const totalExpense = useMemo(
    () => records.filter((record) => record.record_type === 'expense').reduce((sum, record) => sum + Number(record.amount), 0),
    [records],
  )

  const loadItems = async () => {
    const [recordResult, clientResult] = await Promise.all([
      supabase!.from('financial_records').select('*').order('record_date', { ascending: false }),
      supabase!.from('client_records').select('*').order('client_name'),
    ])
    setRecords(recordResult.data ?? [])
    setClients(clientResult.data ?? [])
  }

  useEffect(() => {
    const loadInitialItems = async () => {
      const [recordResult, clientResult] = await Promise.all([
        supabase!.from('financial_records').select('*').order('record_date', { ascending: false }),
        supabase!.from('client_records').select('*').order('client_name'),
      ])
      setRecords(recordResult.data ?? [])
      setClients(clientResult.data ?? [])
    }

    void loadInitialItems()
  }, [])

  const saveItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('Saving...')
    const { error } = await supabase!.from('financial_records').upsert(form)
    setStatus(error ? error.message : 'Financial record saved.')
    if (!error) {
      setForm(emptyRecord)
      await loadItems()
    }
  }

  const deleteItem = async (id?: string) => {
    if (!id) return
    await supabase!.from('financial_records').delete().eq('id', id)
    await loadItems()
  }

  return (
    <AdminGuard>
      <AdminShell title="Finance & Audit" description="Track profit, expenses, payment status, and client-linked records.">
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <SummaryCard label="Income" value={totalIncome} />
          <SummaryCard label="Expenses" value={totalExpense} />
          <SummaryCard label="Net" value={totalIncome - totalExpense} />
        </div>
        <form onSubmit={saveItem} className="mb-8 grid gap-5 rounded-lg border border-coffee/10 bg-white/45 p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Description">
              <TextInput value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
            </Field>
            <Field label="Client">
              <select className="rounded-md border border-coffee/15 bg-white/55 px-3 py-2 text-ink" value={form.client_id ?? ''} onChange={(event) => setForm({ ...form, client_id: event.target.value || null })}>
                <option value="">No client linked</option>
                {clients.map((client) => <option key={client.id} value={client.id}>{client.client_name}</option>)}
              </select>
            </Field>
            <Field label="Type">
              <select className="rounded-md border border-coffee/15 bg-white/55 px-3 py-2 text-ink" value={form.record_type} onChange={(event) => setForm({ ...form, record_type: event.target.value })}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </Field>
            <Field label="Amount">
              <TextInput type="number" value={form.amount} onChange={(event) => setForm({ ...form, amount: Number(event.target.value) })} />
            </Field>
            <Field label="Payment Status">
              <select className="rounded-md border border-coffee/15 bg-white/55 px-3 py-2 text-ink" value={form.payment_status} onChange={(event) => setForm({ ...form, payment_status: event.target.value })}>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
              </select>
            </Field>
            <Field label="Record Date">
              <TextInput type="date" value={form.record_date ?? ''} onChange={(event) => setForm({ ...form, record_date: event.target.value })} />
            </Field>
          </div>
          <Field label="Notes">
            <TextArea value={form.notes ?? ''} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
          </Field>
          <div className="flex items-center gap-4">
            <SaveButton>{form.id ? 'Update Record' : 'Create Record'}</SaveButton>
            {status && <p className="text-sm text-ink/62">{status}</p>}
          </div>
        </form>
        <div className="grid gap-4">
          {records.map((record) => (
            <article key={record.id} className="flex flex-col gap-4 rounded-lg border border-coffee/10 bg-white/40 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-serif text-2xl text-ink">{record.description}</h2>
                <p className="mt-1 text-sm text-coffee">{record.record_type} | {record.payment_status} | {record.record_date}</p>
                <p className="mt-2 text-xl font-semibold text-ink">{record.currency} {Number(record.amount).toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setForm(record)} className="rounded-full border border-coffee/20 px-4 py-2 text-sm text-ink">
                  Edit
                </button>
                <DeleteButton onClick={() => deleteItem(record.id)} />
              </div>
            </article>
          ))}
        </div>
      </AdminShell>
    </AdminGuard>
  )
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-coffee/10 bg-white/45 p-5">
      <p className="text-sm text-ink/55">{label}</p>
      <p className="mt-2 font-serif text-4xl text-ink">PHP {value.toLocaleString()}</p>
    </div>
  )
}
