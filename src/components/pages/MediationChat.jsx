import React, { useState, useEffect } from 'react'
import Layout from '../shared/Layout'
import { supabase } from '../../lib/supabaseClient'

export default function MediationChat({ onNavigate }) {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! I am your neutral household mediator. How can I help resolve a dispute today?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [household, setHousehold] = useState(null)

  useEffect(() => {
    const fetchHousehold = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const { data } = await supabase.from('households').select('*').eq('admin_id', user.id).single()
      setHousehold(data)
    }
    fetchHousehold()
  }, [])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    // AI Simulation for hackathon
    setTimeout(() => {
      let aiResponse = "I've analyzed your household data. "
      if (input.toLowerCase().includes('chore')) {
        aiResponse += "It looks like chores have been unbalanced lately. I suggest Alex takes over the dishes for the next 2 days to even things out."
      } else if (input.toLowerCase().includes('money') || input.toLowerCase().includes('expense')) {
        aiResponse += "Financial transparency is key. I see a $20 imbalance. Perhaps we can set a weekly reminder to settle up every Sunday?"
      } else {
        aiResponse += "Communication is the first step! I recommend scheduling a 10-minute check-in this evening to discuss everyone's expectations."
      }

      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }])
      setLoading(false)
    }, 1500)
  }

  return (
    <Layout activeTab="mediation" onNavigate={onNavigate} householdName={household?.name}>
      <div className="max-w-4xl mx-auto h-[600px] bg-white rounded-card shadow-card flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="bg-dark p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-xl">🤖</div>
            <div>
              <h3 className="font-heading font-bold text-small">Neutral Mediator</h3>
              <p className="text-[10px] text-muted">Analyzing household logs for fairness</p>
            </div>
          </div>
          <div className="text-[10px] bg-white/10 px-3 py-1 rounded-full uppercase tracking-widest font-bold">Live Analysis</div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-off-white">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-card text-small ${
                m.role === 'user' 
                ? 'bg-dark text-white rounded-tr-none shadow-lg' 
                : 'bg-white text-dark border border-border-soft rounded-tl-none shadow-sm'
              }`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-card rounded-tl-none border border-border-soft flex gap-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <form onSubmit={handleSend} className="p-6 bg-white border-t border-border-soft flex gap-4">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe the issue... (e.g. 'Chores feel unfair lately')"
            className="flex-1 bg-off-white border border-border-soft rounded-soft px-6 py-4 text-small focus:outline-none focus:border-accent transition-all"
          />
          <button type="submit" className="bg-accent text-white px-8 py-4 rounded-soft font-bold hover:shadow-lg transition-all transform hover:-translate-y-1">
            Send
          </button>
        </form>
      </div>
    </Layout>
  )
}
