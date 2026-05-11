import React, { useState, useEffect } from 'react'
import Layout from '../shared/Layout'
import { supabase } from '../../lib/supabaseClient'

const CATEGORIES = ['Groceries', 'Household', 'Toiletries', 'Snacks', 'Other']
const CATEGORY_ICONS = {
  Groceries: '🛒',
  Household: '🧹',
  Toiletries: '🧻',
  Snacks: '🍿',
  Other: '📦'
}

export default function ShoppingList({ onNavigate, onSignOut }) {
  const [household, setHousehold] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')
  const [currentUser, setCurrentUser] = useState(null)

  // Form state
  const [newItemName, setNewItemName] = useState('')
  const [newItemCategory, setNewItemCategory] = useState('Groceries')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { onNavigate('login'); return }

      // Get user's member name (or use email prefix as fallback)
      const emailName = user.email.split('@')[0]
      setCurrentUser(emailName)

      const { data: h } = await supabase
        .from('households').select('*').eq('admin_id', user.id).limit(1).maybeSingle()
      
      if (!h) { onNavigate('onboarding'); return }

      const { data: listItems } = await supabase
        .from('shopping_list').select('*').eq('household_id', h.id)
        .order('created_at', { ascending: false })

      setHousehold(h)
      setItems(listItems || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async (e) => {
    e.preventDefault()
    if (!newItemName.trim()) return
    setSubmitting(true)
    
    try {
      const { error } = await supabase.from('shopping_list').insert([{
        household_id: household.id,
        item_name: newItemName.trim(),
        category: newItemCategory,
        added_by: currentUser,
        is_purchased: false
      }])
      
      if (error) throw error
      setNewItemName('')
      fetchData()
    } catch (err) {
      alert(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const togglePurchased = async (id, currentStatus) => {
    try {
      // Optimistic UI update
      setItems(items.map(item => item.id === id ? { ...item, is_purchased: !currentStatus } : item))
      
      const { error } = await supabase
        .from('shopping_list')
        .update({ is_purchased: !currentStatus })
        .eq('id', id)
        
      if (error) throw error
    } catch (err) {
      console.error(err)
      fetchData() // Revert on error
    }
  }

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Remove this item from the list?')) return
    try {
      // Optimistic UI update
      setItems(items.filter(item => item.id !== id))
      
      const { error } = await supabase.from('shopping_list').delete().eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error(err)
      fetchData() // Revert on error
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-warm-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
    </div>
  )

  const pendingItems = items.filter(i => !i.is_purchased && (activeFilter === 'All' || i.category === activeFilter))
  const purchasedItems = items.filter(i => i.is_purchased && (activeFilter === 'All' || i.category === activeFilter))

  return (
    <Layout activeTab="shopping" onNavigate={onNavigate} onSignOut={onSignOut} householdName={household?.name}>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl font-heading font-bold text-dark">Shopping List</h2>
          <p className="text-muted text-sm mt-1">Keep track of what the house needs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: The List */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Add Item Form */}
          <div className="bg-white rounded-card shadow-card border border-border-soft p-5">
            <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                placeholder="Add an item (e.g. Milk, Trash bags)..."
                className="flex-1 bg-off-white border border-border-soft rounded-soft px-4 py-3 text-sm focus:outline-none focus:border-accent"
              />
              <select
                value={newItemCategory}
                onChange={e => setNewItemCategory(e.target.value)}
                className="bg-off-white border border-border-soft rounded-soft px-4 py-3 text-sm focus:outline-none focus:border-accent"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
              </select>
              <button
                type="submit"
                disabled={submitting}
                className="bg-accent text-white px-6 py-3 rounded-soft font-bold text-sm hover:opacity-90 transition-opacity whitespace-nowrap disabled:opacity-50"
              >
                {submitting ? '...' : '+ Add'}
              </button>
            </form>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {['All', ...CATEGORIES].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeFilter === cat
                    ? 'bg-dark text-white shadow-md'
                    : 'bg-white text-muted border border-border-soft hover:border-dark'
                }`}
              >
                {cat !== 'All' && CATEGORY_ICONS[cat]} {cat}
              </button>
            ))}
          </div>

          {/* Pending Items */}
          <div className="space-y-3">
            {pendingItems.length === 0 && purchasedItems.length === 0 ? (
              <div className="bg-white rounded-card shadow-card p-12 text-center border-2 border-dashed border-border-soft">
                <p className="text-4xl mb-4">🛒</p>
                <p className="font-heading font-bold text-dark mb-2">Your list is empty</p>
                <p className="text-muted text-sm">Add some items your household needs above.</p>
              </div>
            ) : pendingItems.length === 0 ? (
              <p className="text-sm text-muted italic p-4 text-center bg-white rounded-card">All items purchased! 🎉</p>
            ) : (
              pendingItems.map(item => (
                <div key={item.id} className="bg-white rounded-soft shadow-sm p-4 flex items-center justify-between group border border-transparent hover:border-border-soft transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <button 
                      onClick={() => togglePurchased(item.id, item.is_purchased)}
                      className="w-6 h-6 rounded border-2 border-accent flex items-center justify-center hover:bg-accent/10 transition-colors flex-shrink-0"
                    >
                    </button>
                    <div>
                      <p className="font-bold text-dark text-sm leading-none">{item.item_name}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] uppercase tracking-widest text-muted bg-off-white px-2 py-0.5 rounded-full font-semibold">
                          {CATEGORY_ICONS[item.category]} {item.category}
                        </span>
                        <span className="text-[10px] text-muted">
                          Added by {item.added_by}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                    title="Delete item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Purchased Items */}
          {purchasedItems.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xs uppercase tracking-widest text-muted font-bold mb-4 flex items-center gap-2">
                <span>Completed</span>
                <span className="bg-dark text-white px-2 py-0.5 rounded-full text-[10px]">{purchasedItems.length}</span>
              </h3>
              <div className="space-y-2 opacity-60 hover:opacity-100 transition-opacity">
                {purchasedItems.map(item => (
                  <div key={item.id} className="bg-off-white rounded-soft p-3 flex items-center justify-between group">
                    <div className="flex items-center gap-4 flex-1">
                      <button 
                        onClick={() => togglePurchased(item.id, item.is_purchased)}
                        className="w-5 h-5 rounded border-2 border-accent bg-accent text-white flex items-center justify-center flex-shrink-0"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>
                      </button>
                      <div>
                        <p className="font-medium text-dark-soft text-sm line-through decoration-muted">{item.item_name}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Summary Widget */}
        <div className="space-y-6">
          <div className="bg-dark text-warm-white p-6 rounded-card shadow-card">
            <h3 className="font-heading font-bold mb-4 flex items-center gap-2">
              📝 List Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-white/10 pb-2">
                <span className="text-sm text-muted">To Buy</span>
                <span className="text-2xl font-bold font-heading">{pendingItems.length}</span>
              </div>
              <div className="flex justify-between items-end border-b border-white/10 pb-2">
                <span className="text-sm text-muted">Purchased</span>
                <span className="text-2xl font-bold font-heading">{purchasedItems.length}</span>
              </div>
              <div className="flex justify-between items-end pb-2">
                <span className="text-sm text-muted">Total Items</span>
                <span className="text-2xl font-bold font-heading">{items.length}</span>
              </div>
            </div>
          </div>

          <div className="bg-accent/10 border border-accent/20 rounded-card p-5">
            <p className="text-xs font-bold text-accent mb-1">💡 Tip</p>
            <p className="text-xs text-muted leading-relaxed">
              When someone buys an item, check it off the list. Don't forget to log it in the <strong>Expenses</strong> tab so everyone splits the cost!
            </p>
          </div>
        </div>

      </div>
    </Layout>
  )
}
