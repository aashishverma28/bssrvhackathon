import React, { useState, useEffect } from 'react'
import Layout from '../shared/Layout'
import { supabase } from '../../lib/supabaseClient'

const CATEGORIES = ['Rent', 'Groceries', 'Utilities', 'Internet', 'Cleaning', 'Entertainment', 'Transport', 'General']

const CATEGORY_ICONS = {
  Rent: '🏠', Groceries: '🛒', Utilities: '💡', Internet: '📶',
  Cleaning: '🧹', Entertainment: '🎬', Transport: '🚗', General: '📦'
}

const CATEGORY_COLORS = {
  Rent: 'bg-purple-100 text-purple-700',
  Groceries: 'bg-green-100 text-green-700',
  Utilities: 'bg-yellow-100 text-yellow-700',
  Internet: 'bg-blue-100 text-blue-700',
  Cleaning: 'bg-teal-100 text-teal-700',
  Entertainment: 'bg-pink-100 text-pink-700',
  Transport: 'bg-orange-100 text-orange-700',
  General: 'bg-gray-100 text-gray-700',
}

export default function Expenses({ onNavigate, onSignOut, user }) {
  const [household, setHousehold] = useState(null)
  const [members, setMembers] = useState([])
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')

  // Form state
  const [form, setForm] = useState({
    title: '',
    amount: '',
    paid_by: '',
    category: 'General',
    split_between: [],
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      if (!user) { onNavigate('login'); return }

      const { data: h } = await supabase
        .from('households').select('*').eq('admin_id', user.id).maybeSingle()
      if (!h) { onNavigate('onboarding'); return }

      // Parallelize fetching members and expenses
      const [membersResponse, expensesResponse] = await Promise.all([
        supabase.from('members').select('*').eq('household_id', h.id),
        supabase.from('expenses').select('*').eq('household_id', h.id).order('created_at', { ascending: false })
      ])

      if (membersResponse.error) throw membersResponse.error
      if (expensesResponse.error) throw expensesResponse.error

      setHousehold(h)
      setMembers(membersResponse.data || [])
      setExpenses(expensesResponse.data || [])

      // Pre-fill split_between with all members
      if (membersResponse.data && membersResponse.data.length > 0) {
        setForm(f => ({ ...f, split_between: membersResponse.data.map(mb => mb.name) }))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddExpense = async (e) => {
    e.preventDefault()
    if (!form.title || !form.amount || !form.paid_by) return
    setSubmitting(true)
    try {
      const { error } = await supabase.from('expenses').insert([{
        household_id: household.id,
        title: form.title,
        amount: parseFloat(form.amount),
        paid_by: form.paid_by,
        category: form.category,
        split_between: form.split_between,
      }])
      if (error) throw error
      setForm({ title: '', amount: '', paid_by: '', category: 'General', split_between: members.map(m => m.name) })
      setShowForm(false)
      fetchData()
    } catch (err) {
      alert(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Delete this expense?')) return
    await supabase.from('expenses').delete().eq('id', id)
    fetchData()
  }

  const toggleMemberSplit = (name) => {
    setForm(f => ({
      ...f,
      split_between: f.split_between.includes(name)
        ? f.split_between.filter(n => n !== name)
        : [...f.split_between, name]
    }))
  }

  // ── Calculations ──────────────────────────────────────────
  const totalSpent = expenses.reduce((s, e) => s + Number(e.amount), 0)

  // Per-person balance: positive = owed money, negative = owes money
  const balances = {}
  members.forEach(m => { balances[m.name] = 0 })

  expenses.forEach(exp => {
    const splitCount = exp.split_between?.length || members.length
    const share = Number(exp.amount) / splitCount
    const splitPeople = exp.split_between?.length ? exp.split_between : members.map(m => m.name)

    // Person who paid gets credited
    if (balances[exp.paid_by] !== undefined) balances[exp.paid_by] += Number(exp.amount)
    // Each person in split owes their share
    splitPeople.forEach(name => {
      if (balances[name] !== undefined) balances[name] -= share
    })
  })

  // Category breakdown
  const byCategory = {}
  expenses.forEach(exp => {
    byCategory[exp.category] = (byCategory[exp.category] || 0) + Number(exp.amount)
  })

  const filteredExpenses = activeFilter === 'All'
    ? expenses
    : expenses.filter(e => e.category === activeFilter)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-warm-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
    </div>
  )

  return (
    <Layout activeTab="expenses" onNavigate={onNavigate} onSignOut={onSignOut} householdName={household?.name}>

      {/* ── Header Row ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl font-heading font-bold text-dark">Shared Expenses</h2>
          <p className="text-muted text-sm mt-1">Track what everyone paid and who owes what</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-soft font-bold text-sm hover:opacity-90 transition-opacity shadow-md"
        >
          {showForm ? '✕ Cancel' : '+ Add Expense'}
        </button>
      </div>

      {/* ── Add Expense Form ── */}
      {showForm && (
        <div className="bg-white rounded-card shadow-card border border-border-soft p-8 mb-8 animate-in slide-in-from-top duration-300">
          <h3 className="font-heading font-bold text-dark mb-6">Log New Expense</h3>
          <form onSubmit={handleAddExpense} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted font-semibold mb-2">
                  Description *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Monthly Groceries"
                  className="w-full bg-off-white border border-border-soft rounded-soft px-4 py-3 text-dark focus:outline-none focus:border-accent transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted font-semibold mb-2">
                  Amount (LKR) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  placeholder="0.00"
                  className="w-full bg-off-white border border-border-soft rounded-soft px-4 py-3 text-dark focus:outline-none focus:border-accent transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted font-semibold mb-2">
                  Paid By *
                </label>
                <select
                  required
                  value={form.paid_by}
                  onChange={e => setForm(f => ({ ...f, paid_by: e.target.value }))}
                  className="w-full bg-off-white border border-border-soft rounded-soft px-4 py-3 text-dark focus:outline-none focus:border-accent transition-colors text-sm"
                >
                  <option value="">Select member...</option>
                  {members.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted font-semibold mb-2">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full bg-off-white border border-border-soft rounded-soft px-4 py-3 text-dark focus:outline-none focus:border-accent transition-colors text-sm"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Split Between */}
            {members.length > 0 && (
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted font-semibold mb-3">
                  Split Between
                </label>
                <div className="flex flex-wrap gap-2">
                  {members.map(m => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => toggleMemberSplit(m.name)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all border-2 ${
                        form.split_between.includes(m.name)
                          ? 'bg-accent text-white border-accent shadow-md'
                          : 'bg-white text-muted border-border-soft hover:border-accent'
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
                {form.split_between.length > 0 && form.amount && (
                  <p className="text-xs text-muted mt-2">
                    Each person pays: <span className="font-bold text-dark">
                      ₹ {(parseFloat(form.amount || 0) / form.split_between.length).toFixed(2)}
                    </span>
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-dark text-white px-8 py-3 rounded-soft font-bold text-sm hover:bg-accent transition-colors disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Expense'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-dark text-warm-white p-6 rounded-card shadow-card">
          <p className="text-xs uppercase tracking-widest text-muted mb-2">Total Spent</p>
          <p className="text-3xl font-heading font-bold">₹ {totalSpent.toLocaleString()}</p>
          <p className="text-xs text-muted mt-1">{expenses.length} transactions</p>
        </div>
        <div className="bg-white p-6 rounded-card shadow-card border border-border-soft">
          <p className="text-xs uppercase tracking-widest text-muted mb-2">Per Person (avg)</p>
          <p className="text-3xl font-heading font-bold text-dark">
            ₹ {members.length ? (totalSpent / members.length).toFixed(0) : 0}
          </p>
          <p className="text-xs text-muted mt-1">fair share each</p>
        </div>
        <div className="bg-accent/10 p-6 rounded-card shadow-card border border-accent/20">
          <p className="text-xs uppercase tracking-widest text-muted mb-2">Members Tracking</p>
          <p className="text-3xl font-heading font-bold text-dark">{members.length}</p>
          <p className="text-xs text-muted mt-1">active roommates</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Left: Expense List ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {['All', ...CATEGORIES.filter(c => byCategory[c])].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeFilter === cat
                    ? 'bg-dark text-white'
                    : 'bg-white text-muted border border-border-soft hover:border-dark'
                }`}
              >
                {cat !== 'All' && CATEGORY_ICONS[cat]} {cat}
                {cat !== 'All' && byCategory[cat] && (
                  <span className="ml-1 opacity-70">· ₹ {byCategory[cat].toLocaleString()}</span>
                )}
              </button>
            ))}
          </div>

          {/* Expense Items */}
          <div className="space-y-3">
            {filteredExpenses.length === 0 ? (
              <div className="bg-white rounded-card shadow-card p-12 text-center">
                <p className="text-4xl mb-4">💸</p>
                <p className="font-heading font-bold text-dark mb-2">No expenses yet</p>
                <p className="text-muted text-sm">Click "Add Expense" to log your first shared cost</p>
              </div>
            ) : (
              filteredExpenses.map(exp => {
                const splitCount = exp.split_between?.length || members.length
                const share = splitCount > 0 ? Number(exp.amount) / splitCount : 0
                return (
                  <div key={exp.id} className="bg-white rounded-card shadow-card p-5 flex items-center gap-4 hover:shadow-md transition-shadow group">
                    {/* Category Icon */}
                    <div className="w-11 h-11 rounded-full bg-off-white flex items-center justify-center text-xl flex-shrink-0">
                      {CATEGORY_ICONS[exp.category] || '📦'}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-dark text-sm">{exp.title}</p>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${CATEGORY_COLORS[exp.category] || CATEGORY_COLORS.General}`}>
                          {exp.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted mt-1">
                        Paid by <span className="font-semibold text-dark">{exp.paid_by}</span>
                        {exp.split_between?.length > 0 && (
                          <span> · Split {splitCount} ways (₹ {share.toFixed(0)} each)</span>
                        )}
                      </p>
                      <p className="text-[10px] text-muted mt-0.5">
                        {new Date(exp.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>

                    {/* Amount */}
                    <div className="text-right flex-shrink-0">
                      <p className="font-heading font-bold text-dark text-lg">₹ {Number(exp.amount).toLocaleString()}</p>
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="text-[10px] text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 mt-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* ── Right: Balances & Breakdown ── */}
        <div className="space-y-6">

          {/* Who Owes What */}
          <div className="bg-white rounded-card shadow-card p-6 border border-border-soft">
            <h3 className="font-heading font-bold text-dark mb-5 flex items-center gap-2">
              ⚖️ Settlement Summary
            </h3>
            {members.length === 0 ? (
              <p className="text-muted text-sm text-center py-4">Add roommates from the Dashboard first</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(balances).map(([name, bal]) => (
                  <div key={name}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-semibold text-dark">{name}</span>
                      <span className={`text-sm font-bold ${bal > 0 ? 'text-green-600' : bal < 0 ? 'text-red-500' : 'text-muted'}`}>
                        {bal > 0 ? `+₹ ${bal.toFixed(0)}` : bal < 0 ? `-₹ ${Math.abs(bal).toFixed(0)}` : 'Settled ✓'}
                      </span>
                    </div>
                    <div className="h-1.5 bg-off-white rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${bal > 0 ? 'bg-green-500' : 'bg-red-400'}`}
                        style={{ width: `${Math.min(Math.abs(bal) / (totalSpent / members.length + 1) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted mt-1">
                      {bal > 0 ? 'is owed money' : bal < 0 ? 'owes money' : 'all settled'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Breakdown */}
          {Object.keys(byCategory).length > 0 && (
            <div className="bg-dark text-warm-white rounded-card shadow-card p-6">
              <h3 className="font-heading font-bold mb-5 flex items-center gap-2">
                📊 By Category
              </h3>
              <div className="space-y-3">
                {Object.entries(byCategory)
                  .sort(([, a], [, b]) => b - a)
                  .map(([cat, amt]) => {
                    const pct = totalSpent > 0 ? (amt / totalSpent) * 100 : 0
                    return (
                      <div key={cat}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span>{CATEGORY_ICONS[cat]} {cat}</span>
                          <span className="font-bold">₹ {amt.toLocaleString()} <span className="text-muted font-normal">({pct.toFixed(0)}%)</span></span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full">
                          <div
                            className="h-full bg-accent rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}

          {/* Quick Tip */}
          <div className="bg-accent/10 border border-accent/20 rounded-card p-5">
            <p className="text-xs font-bold text-accent mb-1">💡 How balances work</p>
            <p className="text-xs text-muted leading-relaxed">
              Green = person paid more than their share (is owed). Red = person owes others. Settle up by transferring the shown amount.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
