import React from 'react'

export default function Layout({ children, activeTab, onNavigate, onSignOut, householdName }) {
  const menuItems = [
    { id: 'overview',       label: 'Dashboard',     icon: '📊', view: 'dashboard'     },
    { id: 'chores',         label: 'Chore Board',   icon: '🧹', view: 'chores'        },
    { id: 'expenses',       label: 'Expenses',      icon: '💰', view: 'expenses'      },
    { id: 'mediation',      label: 'AI Mediation',  icon: '🤖', view: 'mediation'     },
    { id: 'rules',          label: 'House Rules',   icon: '📜', view: 'rules'         },
    { id: 'shopping',       label: 'Shopping List', icon: '🛒', view: 'shopping'      },
    { id: 'notifications',  label: 'Alerts',        icon: '🔔', view: 'notifications' },
  ]

  const handleSignOut = async () => {
    if (onSignOut) {
      await onSignOut()
    } else {
      onNavigate('landing')
    }
  }

  return (
    <div className="min-h-screen bg-off-white flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-dark text-warm-white p-8 flex flex-col justify-between md:min-h-screen">
        <div>
          {/* Logo */}
          <div
            className="font-heading font-bold text-xl tracking-tight mb-12 cursor-pointer"
            onClick={() => onNavigate('dashboard')}
          >
            Roommate<span className="text-accent">Harmony</span>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.view)}
                className={`w-full text-left px-4 py-3 rounded-soft transition-all flex items-center gap-3 text-small ${
                  activeTab === item.id
                    ? 'bg-accent text-white shadow-md'
                    : 'text-muted hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="text-muted hover:text-white text-small flex items-center gap-2 p-4 border-t border-white/10 transition-colors w-full text-left"
        >
          🚪 <span>Sign Out</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* Page Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-dark">
              {householdName || 'My Household'}
            </h1>
            <p className="text-muted text-small mt-1">Stability: Safe &amp; Collaborative</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-full shadow-sm text-xs font-bold text-dark border border-border-soft">
            🏠 {householdName || 'Your Home'}
          </div>
        </header>

        {/* Page Content */}
        {children}
      </main>
    </div>
  )
}
