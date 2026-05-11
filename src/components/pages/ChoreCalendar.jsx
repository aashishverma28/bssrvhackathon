import React, { useState, useEffect } from 'react'
import Layout from '../shared/Layout'
import { supabase } from '../../lib/supabaseClient'

export default function ChoreCalendar({ onNavigate, user }) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const [schedules, setSchedules] = useState([])
  const [household, setHousehold] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return
      const { data: h } = await supabase.from('households').select('*').eq('admin_id', user.id).single()
      if (!h) return
      setHousehold(h)
      
      const { data: s } = await supabase.from('schedules').select('*').eq('household_id', h.id)
      setSchedules(s || [])
    }
    fetchData()
  }, [user])

  return (
    <Layout activeTab="chores" onNavigate={onNavigate} householdName={household?.name}>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {days.map(day => (
          <div key={day} className="bg-white rounded-card shadow-card overflow-hidden flex flex-col min-h-[400px]">
            <div className="bg-dark text-white p-4 text-center font-bold text-xs uppercase tracking-widest">
              {day}
            </div>
            <div className="flex-1 p-4 space-y-3">
              {schedules.filter(s => s.day_of_week === day).map((s, i) => (
                <div key={i} className="p-3 bg-accent-sage/10 border-l-4 border-accent-sage rounded-soft">
                  <div className="font-bold text-xs text-dark">{s.title}</div>
                  <div className="text-[10px] text-muted flex justify-between mt-2">
                    <span>👤 {s.member_name}</span>
                    <span>✅ Done</span>
                  </div>
                </div>
              ))}
              <button className="w-full py-3 border-2 border-dashed border-border-soft rounded-soft text-[10px] text-muted hover:border-accent hover:text-accent transition-all font-bold">
                + Add Task
              </button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}
