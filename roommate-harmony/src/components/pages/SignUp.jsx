import React, { useState } from 'react'
import Button from '../ui/Button'
import RotatedTag from '../shared/RotatedTag'
import { supabase } from '../../lib/supabaseClient'

export default function SignUp({ onNavigate }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [householdName, setHouseholdName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            household_name: householdName
          }
        }
      })

      if (error) throw error

      if (data.user) {
        alert('Account created successfully! You can now log in.')
        onNavigate('login')
      }
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-warm-white flex items-center justify-center p-6">
      
      <button 
        onClick={() => onNavigate('landing')}
        className="absolute top-8 left-8 flex items-center gap-2 text-dark-soft hover:text-accent transition-colors font-medium text-small"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
          <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
        </svg>
        Back to Home
      </button>

      <div className="w-full max-w-[1000px] bg-white rounded-card shadow-alert overflow-hidden flex flex-col md:flex-row-reverse">
        
        {/* Value Prop */}
        <div className="w-full md:w-1/2 bg-accent text-warm-white p-12 flex flex-col justify-between">
          <div>
            <div className="font-heading font-bold text-white text-2xl tracking-tight mb-8 flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
              <span>Roommate<span className="text-dark">Harmony</span></span>
            </div>
            <h2 className="text-headline font-heading font-bold leading-tight">
              Start building a better home today.
            </h2>
            <p className="text-body text-warm-white/80 mt-6 max-w-sm">
              Create your household account to stop disputes before they happen. Join 2,000+ happy homes.
            </p>
          </div>
          
          <div className="mt-12">
            <RotatedTag className="bg-dark text-white">Join the Community</RotatedTag>
          </div>
        </div>

        {/* Form */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-off-white">
          <h3 className="text-title font-heading font-bold text-dark mb-2">Create Account</h3>
          <p className="text-small text-muted mb-8">
            Set up your household in seconds.
          </p>

          <form onSubmit={handleSignUp} className="space-y-5">
             <div>
              <label className="block text-label uppercase tracking-widest text-muted font-medium mb-2">
                Household Name
              </label>
              <input 
                type="text" 
                required
                value={householdName}
                onChange={(e) => setHouseholdName(e.target.value)}
                placeholder="e.g. The 404 Apartment"
                className="w-full bg-white border border-border-soft rounded-soft px-4 py-3 text-dark focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div>
              <label className="block text-label uppercase tracking-widest text-muted font-medium mb-2">
                Email Address
              </label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white border border-border-soft rounded-soft px-4 py-3 text-dark focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div>
              <label className="block text-label uppercase tracking-widest text-muted font-medium mb-2">
                Create Password
              </label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full bg-white border border-border-soft rounded-soft px-4 py-3 text-dark focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <Button variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Get Started'}
            </Button>
          </form>

          <p className="text-center text-small text-muted mt-8">
            Already have an account? <button onClick={() => onNavigate('login')} className="text-accent hover:underline font-bold">Log In</button>
          </p>
        </div>
      </div>

    </div>
  )
}
