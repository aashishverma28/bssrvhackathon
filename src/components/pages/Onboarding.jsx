import React, { useState } from 'react'
import Button from '../ui/Button'
import { supabase } from '../../lib/supabaseClient'

export default function Onboarding({ onNavigate }) {
  const [step, setStep] = useState(1)
  const [householdName, setHouseholdName] = useState('')
  const [roommates, setRoommates] = useState([])
  const [newRoommate, setNewRoommate] = useState('')

  const handleNext = () => setStep(step + 1)
  const handleBack = () => setStep(step - 1)

  const addRoommate = () => {
    if (newRoommate) {
      setRoommates([...roommates, newRoommate])
      setNewRoommate('')
    }
  }

  const completeOnboarding = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      // Update household name if needed, or just proceed
      // For now, we'll just navigate to dashboard
      onNavigate('dashboard')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-card shadow-alert p-12">
        <div className="flex justify-between mb-12">
          {[1, 2, 3, 4].map(s => (
            <div 
              key={s} 
              className={`h-2 flex-1 rounded-full mx-1 transition-colors ${s <= step ? 'bg-accent' : 'bg-off-white'}`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="animate-in slide-in-from-right duration-500">
            <h2 className="text-headline font-heading font-bold mb-4">Name your sanctuary</h2>
            <p className="text-muted mb-8">This is the name everyone in your household will see.</p>
            <input 
              type="text"
              value={householdName}
              onChange={(e) => setHouseholdName(e.target.value)}
              placeholder="e.g. The 404 Apartment"
              className="w-full bg-off-white border border-border-soft rounded-soft px-6 py-4 text-xl focus:outline-none focus:border-accent"
            />
          </div>
        )}

        {step === 2 && (
          <div className="animate-in slide-in-from-right duration-500">
            <h2 className="text-headline font-heading font-bold mb-4">Who's living here?</h2>
            <p className="text-muted mb-8">Add the names of your roommates. You can invite them later.</p>
            <div className="flex gap-2 mb-6">
              <input 
                type="text"
                value={newRoommate}
                onChange={(e) => setNewRoommate(e.target.value)}
                placeholder="Roommate name"
                className="flex-1 bg-off-white border border-border-soft rounded-soft px-4 py-3 focus:outline-none"
              />
              <Button onClick={addRoommate} variant="secondary">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {roommates.map((r, i) => (
                <div key={i} className="bg-accent-sage text-white px-4 py-2 rounded-full text-small">
                  {r}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in slide-in-from-right duration-500">
            <h2 className="text-headline font-heading font-bold mb-4">Set the baseline</h2>
            <p className="text-muted mb-8">What are the most important rules for your home?</p>
            <div className="space-y-4">
              {['No loud music after 10PM', 'Dishes cleared within 24h', 'Quiet hours on weekends'].map((rule, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-off-white rounded-soft border border-border-soft">
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-accent" />
                  <span className="text-dark-soft font-medium">{rule}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in slide-in-from-right duration-500 text-center">
            <div className="text-6xl mb-8">🤝</div>
            <h2 className="text-headline font-heading font-bold mb-4">Ready for Harmony</h2>
            <p className="text-muted mb-12">Your household is set up. Let's start building a better home together.</p>
          </div>
        )}

        <div className="mt-12 flex justify-between">
          {step > 1 ? (
            <button onClick={handleBack} className="text-muted hover:text-dark font-bold">Back</button>
          ) : <div />}
          
          {step < 4 ? (
            <Button onClick={handleNext}>Continue</Button>
          ) : (
            <Button onClick={completeOnboarding}>Go to Dashboard</Button>
          )}
        </div>
      </div>
    </div>
  )
}
