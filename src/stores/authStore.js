import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const useAuthStore = create((set) => ({
  user: null,
  session: null,
  loading: true,
  error: null,

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    set({
      session,
      user: session?.user ?? null,
      loading: false,
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      set({
        session,
        user: session?.user ?? null,
      })
    })
  },

  signIn: async (email, password) => {
    set({ error: null, loading: true })
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      set({ error: error.message, loading: false })
      return false
    }
    set({ user: data.user, session: data.session, loading: false })
    return true
  },

  signUp: async (email, password) => {
    set({ error: null, loading: true })
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      set({ error: error.message, loading: false })
      return false
    }
    set({ user: data.user, session: data.session, loading: false })
    return true
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, session: null })
  },

  clearError: () => set({ error: null }),
}))

export default useAuthStore
