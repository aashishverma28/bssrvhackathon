import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import Landing from './components/pages/Landing'
import Login from './components/pages/Login'
import SignUp from './components/pages/SignUp'
import Dashboard from './components/pages/Dashboard'
import Onboarding from './components/pages/Onboarding'
import MediationChat from './components/pages/MediationChat'
import ChoreCalendar from './components/pages/ChoreCalendar'
import Expenses from './components/pages/Expenses'
import ShoppingList from './components/pages/ShoppingList'
import HouseRules from './components/pages/HouseRules'

export default function App() {
  // Start on landing immediately — no blocking spinner
  const [currentView, setCurrentView] = useState('landing')
  const [user, setUser] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    // Check session once in the background without blocking UI
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
          await checkHouseholdAndRoute(session.user)
        }
      } catch (err) {
        // Silently fail — user stays on landing
        console.error('Session check failed:', err)
      } finally {
        setAuthChecked(true)
      }
    }

    checkSession()

    // Listen for future auth changes (login/logout/token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!authChecked && event === 'INITIAL_SESSION') return 

        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          // Instant navigation to dashboard; Dashboard will redirect to onboarding if needed
          setCurrentView('dashboard')
        }

        if (event === 'SIGNED_OUT') {
          setUser(null)
          setCurrentView('landing')
        }

        if (event === 'TOKEN_REFRESHED' && session?.user) {
          setUser(session.user)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const checkHouseholdAndRoute = async (authUser) => {
    try {
      const { data: household, error: hError } = await supabase
        .from('households')
        .select('id')
        .eq('admin_id', authUser.id)
        .limit(1)
        .maybeSingle()

      if (hError) console.error('Household query error:', hError)

      setCurrentView(household ? 'dashboard' : 'onboarding')
    } catch (err) {
      console.error('Household check failed:', err)
      setCurrentView('dashboard')
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    // onAuthStateChange SIGNED_OUT event will reset state
  }

  const handleNavigate = (view) => setCurrentView(view)

  return (
    <main className="bg-warm-white text-dark font-body min-h-screen">
      {/* Public Routes */}
      {currentView === 'landing'    && <Landing    onNavigate={handleNavigate} />}
      {currentView === 'login'      && <Login      onNavigate={handleNavigate} />}
      {currentView === 'signup'     && <SignUp     onNavigate={handleNavigate} />}
      {currentView === 'onboarding' && <Onboarding onNavigate={handleNavigate} user={user} />}

      {/* Protected Routes */}
      {currentView === 'dashboard'  && <Dashboard     onNavigate={handleNavigate} onSignOut={handleSignOut} user={user} />}
      {currentView === 'mediation'  && <MediationChat  onNavigate={handleNavigate} onSignOut={handleSignOut} user={user} />}
      {currentView === 'chores'     && <ChoreCalendar  onNavigate={handleNavigate} onSignOut={handleSignOut} user={user} />}
      {currentView === 'rules'      && <HouseRules     onNavigate={handleNavigate} onSignOut={handleSignOut} user={user} />}

      {currentView === 'expenses'   && <Expenses       onNavigate={handleNavigate} onSignOut={handleSignOut} user={user} />}
      {currentView === 'shopping'   && <ShoppingList   onNavigate={handleNavigate} onSignOut={handleSignOut} user={user} />}

      {/* Under Construction */}
      {(['notifications'].includes(currentView)) && (
        <div className="min-h-screen flex items-center justify-center bg-off-white p-20 text-center">
          <div>
            <p className="text-5xl mb-4">🚧</p>
            <h1 className="text-headline font-heading font-bold mb-4">Under Construction</h1>
            <p className="text-muted mb-8">This module is coming soon.</p>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="bg-accent text-white px-8 py-3 rounded-soft font-bold hover:opacity-90 transition-opacity"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
