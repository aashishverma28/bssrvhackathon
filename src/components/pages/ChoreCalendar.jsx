import React, { useState, useEffect } from 'react'
import Layout from '../shared/Layout'
import { supabase } from '../../lib/supabaseClient'

export default function ChoreCalendar({ onNavigate, user }) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const [schedules, setSchedules] = useState([])
  const [members, setMembers] = useState([])
  const [household, setHousehold] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', member_name: '', day_of_week: 'Monday', frequency: 'weekly' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      if (!user) return
      
      const { data: h } = await supabase.from('households').select('*').eq('admin_id', user.id).maybeSingle()
      if (!h) {
        onNavigate('onboarding')
        return
      }
      setHousehold(h)

      const [schedulesRes, membersRes] = await Promise.all([
        supabase.from('schedules').select('*').eq('household_id', h.id),
        supabase.from('members').select('*').eq('household_id', h.id)
      ])

      setSchedules(schedulesRes.data || [])
      setMembers(membersRes.data || [])
      
      if (membersRes.data && membersRes.data.length > 0 && !newTask.member_name) {
        setNewTask(prev => ({ ...prev, member_name: membersRes.data[0].name }))
      }

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (day) => {
    setNewTask(prev => ({ ...prev, day_of_week: day, title: '' }))
    setIsModalOpen(true)
  }

  const handleSaveTask = async (e) => {
    e.preventDefault()
    if (!newTask.title || !newTask.member_name) return
    setSubmitting(true)

    try {
      const { error } = await supabase.from('schedules').insert([{
        household_id: household.id,
        ...newTask
      }])

      if (error) throw error
      
      setIsModalOpen(false)
      fetchData()
    } catch (err) {
      alert(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return
    try {
      const { error } = await supabase.from('schedules').delete().eq('id', id)
      if (error) throw error
      setSchedules(schedules.filter(s => s.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const handleMarkDone = async (task) => {
    try {
      // Log the completion in the activity log
      const { error } = await supabase.from('logs').insert([{
        household_id: household.id,
        member_name: task.member_name,
        type: 'chore',
        amount: 0,
        timestamp: new Date().toISOString()
      }])
      
      if (error) throw error
      
      // For visual feedback, we could delete it if it's a one-off, 
      // but usually schedules are recurring. For this demo, let's just show an alert.
      alert(`Great job, ${task.member_name}! Chore "${task.title}" has been logged.`)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-warm-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
    </div>
  )

  return (
    <Layout activeTab="chores" onNavigate={onNavigate} householdName={household?.name}>
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-heading font-bold text-dark">Chore Board</h2>
          <p className="text-muted text-sm mt-1">Weekly rotation and responsibility tracking</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {days.map(day => (
          <div key={day} className="bg-white rounded-card shadow-card overflow-hidden flex flex-col min-h-[450px] border border-border-soft">
            <div className="bg-dark text-white p-4 text-center font-bold text-[10px] uppercase tracking-widest">
              {day}
            </div>
            <div className="flex-1 p-3 space-y-3">
              {schedules.filter(s => s.day_of_week === day).map((s) => (
                <div key={s.id} className="p-3 bg-accent/5 border-l-4 border-accent rounded-soft group relative transition-all hover:bg-accent/10">
                  <div className="font-bold text-xs text-dark pr-4">{s.title}</div>
                  <div className="text-[10px] text-muted flex justify-between mt-2">
                    <span>👤 {s.member_name}</span>
                    <button 
                      onClick={() => handleMarkDone(s)}
                      className="text-accent font-bold hover:underline"
                    >
                      Done?
                    </button>
                  </div>
                  
                  {/* Delete Button */}
                  <button 
                    onClick={() => handleDeleteTask(s.id)}
                    className="absolute top-2 right-2 text-muted opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>
                  </button>
                </div>
              ))}
              
              <button 
                onClick={() => handleOpenModal(day)}
                className="w-full py-3 border-2 border-dashed border-border-soft rounded-soft text-[10px] text-muted hover:border-accent hover:text-accent transition-all font-bold mt-2"
              >
                + Add Task
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-dark/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-card shadow-alert w-full max-w-md p-8">
            <h3 className="text-xl font-heading font-bold text-dark mb-6">Add Chore for {newTask.day_of_week}</h3>
            
            <form onSubmit={handleSaveTask} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted font-bold block mb-2">Chore Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Vacuum living room"
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  className="w-full bg-off-white border border-border-soft rounded-soft px-4 py-3 text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted font-bold block mb-2">Assign To</label>
                <select 
                  value={newTask.member_name}
                  onChange={e => setNewTask({...newTask, member_name: e.target.value})}
                  className="w-full bg-off-white border border-border-soft rounded-soft px-4 py-3 text-sm focus:outline-none focus:border-accent"
                >
                  {members.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-border-soft rounded-soft text-sm font-bold text-muted hover:bg-off-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-accent text-white rounded-soft text-sm font-bold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </Layout>
  )
}
