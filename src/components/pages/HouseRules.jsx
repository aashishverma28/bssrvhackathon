import React, { useState, useEffect } from 'react'
import Layout from '../shared/Layout'
import { supabase } from '../../lib/supabaseClient'

export default function HouseRules({ onNavigate, user }) {
  const [rules, setRules] = useState([])
  const [household, setHousehold] = useState(null)
  const [newRule, setNewRule] = useState({ category: 'General', description: '' })

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return
      const { data: h } = await supabase.from('households').select('*').eq('admin_id', user.id).single()
      if (!h) return
      setHousehold(h)
      const { data: r } = await supabase.from('rules').select('*').eq('household_id', h.id)
      setRules(r || [])
    }
    fetchData()
  }, [user])

  const addRule = async (e) => {
    e.preventDefault()
    if (!newRule.description) return
    const { error } = await supabase.from('rules').insert([{ ...newRule, household_id: household.id }])
    if (!error) {
      setNewRule({ ...newRule, description: '' })
      // Re-fetch
      const { data: r } = await supabase.from('rules').select('*').eq('household_id', household.id)
      setRules(r || [])
    }
  }

  return (
    <Layout activeTab="rules" onNavigate={onNavigate} householdName={household?.name}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {rules.length === 0 ? (
             <div className="bg-white p-12 rounded-card text-center shadow-card border-2 border-dashed border-border-soft">
                <div className="text-4xl mb-4">📜</div>
                <h3 className="text-title font-heading font-bold text-dark">No rules set yet</h3>
                <p className="text-muted">Documented agreements prevent future disputes.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rules.map(rule => (
                <div key={rule.id} className="bg-white p-6 rounded-card shadow-card border-l-4 border-accent">
                  <span className="text-[10px] uppercase tracking-widest text-accent font-bold mb-2 block">{rule.category}</span>
                  <p className="text-small text-dark-soft leading-relaxed">{rule.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-dark p-8 rounded-card text-white shadow-alert h-fit sticky top-8">
          <h3 className="text-title font-heading font-bold mb-6">Add New Rule</h3>
          <form onSubmit={addRule} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted block mb-2 font-bold">Category</label>
              <select 
                value={newRule.category}
                onChange={(e) => setNewRule({...newRule, category: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-soft px-4 py-3 text-small text-white"
              >
                <option value="General">General</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Guests">Guests</option>
                <option value="Quiet Hours">Quiet Hours</option>
                <option value="Expenses">Expenses</option>
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted block mb-2 font-bold">Rule Description</label>
              <textarea 
                value={newRule.description}
                onChange={(e) => setNewRule({...newRule, description: e.target.value})}
                rows="4"
                placeholder="Describe the agreement..."
                className="w-full bg-white/5 border border-white/10 rounded-soft px-4 py-3 text-small text-white focus:outline-none focus:border-accent transition-all"
              ></textarea>
            </div>
            <button type="submit" className="w-full bg-accent text-white py-4 rounded-soft font-bold hover:shadow-lg transition-all">
              Add to Board
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
