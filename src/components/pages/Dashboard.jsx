import React, { useState, useEffect } from 'react'
import Layout from '../shared/Layout'
import StabilityScore from '../ui/StabilityScore'
import ParticipationBar from '../ui/ParticipationBar'
import Button from '../ui/Button'
import RotatedTag from '../shared/RotatedTag'
import { supabase } from '../../lib/supabaseClient'

export default function Dashboard({ onNavigate, onSignOut, user }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [newMemberName, setNewMemberName] = useState('')
  const [logs, setLogs] = useState([])
  const [debugMsg, setDebugMsg] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setDebugMsg('Getting user...')
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        setLoading(false)
        onNavigate('login')
        return
      }

      setDebugMsg('Getting household...')
      const { data: householdData, error: hError } = await supabase
        .from('households')
        .select('*')
        .eq('admin_id', user.id)
        .limit(1)
        .maybeSingle()

      if (hError) {
        console.error("Household query error:", hError)
        // Don't just fail, let's see what the error is
      }

      // No household found → send to onboarding
      if (!householdData) {
        setLoading(false)
        onNavigate('onboarding')
        return
      }

      setDebugMsg('Getting members...')
      const { data: membersData, error: mError } = await supabase
        .from('members')
        .select('*')
        .eq('household_id', householdData.id)

      if (mError) throw mError

      setDebugMsg('Getting logs...')
      const { data: logsData, error: lError } = await supabase
        .from('logs')
        .select('*')
        .eq('household_id', householdData.id)
        .order('timestamp', { ascending: false })

      if (lError) throw lError

      setData({ household: householdData, members: membersData })
      setLogs(logsData || [])
      setLoading(false)
    } catch (err) {
      console.error(err)
      setError(err.message || 'An unknown error occurred')
      setLoading(false)
    }
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    if (!newMemberName) return
    try {
      const { error } = await supabase
        .from('members')
        .insert([{ name: newMemberName, household_id: data.household.id }])
      
      if (error) throw error
      setNewMemberName('')
      fetchDashboardData()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleLogChore = async (memberName) => {
    try {
      const { error } = await supabase
        .from('logs')
        .insert([{ 
          member_name: memberName, 
          type: 'chore', 
          household_id: data.household.id 
        }])
      
      if (error) throw error
      fetchDashboardData()
    } catch (err) {
      console.error(err)
    }
  }

  const handleLogExpense = async (memberName, amount) => {
    try {
      const { error } = await supabase
        .from('logs')
        .insert([{ 
          member_name: memberName, 
          type: 'expense', 
          amount,
          household_id: data.household.id 
        }])
      
      if (error) throw error
      fetchDashboardData()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-warm-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mb-4"></div>
      <p className="text-muted text-sm">{debugMsg || 'Loading...'}</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-warm-white p-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-dark mb-4">Setup Required</h2>
        <p className="text-muted mb-8">We couldn't find your household. Please sign up or try again.</p>
        <Button onClick={() => onNavigate('signup')}>Go to Sign Up</Button>
      </div>
    </div>
  )

  const { household, members } = data

  return (
    <Layout activeTab="overview" onNavigate={onNavigate} onSignOut={onSignOut} householdName={household.name}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Health Score & Participation */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-card shadow-card">
              <h3 className="text-small uppercase tracking-widest text-muted mb-6">Household Health Score</h3>
              <StabilityScore score={household.stability_score} label={household.stability_label} />
              <div className="mt-8 p-4 bg-off-white rounded-soft border border-border-soft">
                <p className="text-small text-dark-soft italic">
                  {members.length === 0 
                    ? "Start by adding your roommates to see your stability score calculation."
                    : "Stability is active. Tracking contributions from your household members."}
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-card shadow-card">
              <h3 className="text-small uppercase tracking-widest text-muted mb-8">Member Participation</h3>
              <div className="space-y-8">
                {members.length === 0 ? (
                  <p className="text-center text-muted py-8 italic text-small">No roommates added yet.</p>
                ) : (
                  members.map(member => (
                    <ParticipationBar key={member.id} name={member.name} score={member.score} />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Quick Actions & Management */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-card shadow-card border-t-4 border-accent">
              <h3 className="text-title font-heading font-bold text-dark mb-4">Manage Roommates</h3>
              <form onSubmit={handleAddMember} className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Roommate name"
                  className="flex-1 bg-off-white border border-border-soft rounded-soft px-3 py-2 text-xs focus:outline-none focus:border-accent"
                />
                <button type="submit" className="bg-dark text-white px-3 py-2 rounded-soft text-xs font-bold hover:bg-accent transition-colors">
                  Add
                </button>
              </form>
              
              {members.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-border-soft">
                  <label className="text-xs uppercase tracking-tighter text-muted block mb-2 font-bold">Quick Log Activity</label>
                  <div className="flex flex-wrap gap-2">
                    {members.map(m => (
                      <div key={m.id} className="flex flex-col gap-1">
                        <button 
                          onClick={() => handleLogChore(m.name)}
                          className="px-3 py-1 bg-accent-sage text-white rounded-full text-[10px] hover:opacity-80 transition-opacity"
                        >
                          + Chore {m.name}
                        </button>
                        <button 
                          onClick={() => handleLogExpense(m.name, 10)}
                          className="px-3 py-1 bg-accent-amber text-white rounded-full text-[10px] hover:opacity-80 transition-opacity"
                        >
                          + ₹10 {m.name}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-dark p-8 rounded-card text-warm-white">
              <h3 className="font-heading font-bold mb-2">Household Activity</h3>
              <div className="space-y-4">
                {logs.slice(0, 3).map(log => (
                  <div key={log.id} className="text-xs border-l-2 border-accent pl-3">
                    <span className="font-bold text-accent">{log.member_name}</span> 
                    {log.type === 'chore' ? ' completed a chore' : ` spent ₹${log.amount}`}
                  </div>
                ))}
                {logs.length === 0 && <p className="text-xs text-muted">No recent activity.</p>}
              </div>
            </div>
          </div>
        </div>
    </Layout>
  )
}

