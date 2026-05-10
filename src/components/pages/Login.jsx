import React, { useState } from 'react'
import Button from '../ui/Button'
import RotatedTag from '../shared/RotatedTag'
import { supabase } from '../../lib/supabaseClient'

export default function Login({ onNavigate }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      
      if (data.user) {
        onNavigate('dashboard')
      }
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-warm-white flex items-center justify-center p-6">
      
      {/* Back button */}
      <button 
        onClick={() => onNavigate('landing')}
        className="absolute top-8 left-8 flex items-center gap-2 text-dark-soft hover:text-accent transition-colors font-medium text-small"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
          <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
        </svg>
        Back to Home
      </button>

      <div className="w-full max-w-[1000px] bg-white rounded-card shadow-alert overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Brand & Value Prop */}
        <div className="w-full md:w-1/2 bg-dark p-12 flex flex-col justify-between">
          <div>
            <div className="font-heading font-bold text-white text-2xl tracking-tight mb-8">
              Roommate<span className="text-accent">Harmony</span>
            </div>
            <h2 className="text-headline font-heading font-bold text-warm-white leading-tight">
              Welcome back to your shared space.
            </h2>
            <p className="text-body text-muted mt-6 max-w-sm">
              Log in to view your household stability score, check chore distributions, and review shared expenses.
            </p>
          </div>
          
          <div className="mt-12 hidden md:block">
            <RotatedTag>Client Portal</RotatedTag>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-off-white">
          <h3 className="text-title font-heading font-bold text-dark mb-2">Log In</h3>
          <p className="text-small text-muted mb-8">
            Enter your details to access your dashboard.
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
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
              <div className="flex items-center justify-between mb-2">
                <label className="block text-label uppercase tracking-widest text-muted font-medium">
                  Password
                </label>
                <a href="#" className="text-small text-accent hover:underline">Forgot password?</a>
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-border-soft rounded-soft px-4 py-3 text-dark focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-small text-muted mt-8">
            Don't have a household yet? <button onClick={() => onNavigate('signup')} className="text-accent hover:underline font-bold">Create one</button>
          </p>
        </div>
      </div>

    </div>
  )
}
