import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import useAuthStore from './authStore'

const useSubjectStore = create((set, get) => ({
  subjects: [],
  loading: false,
  error: null,

  fetch: async () => {
    set({ loading: true, error: null })
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      set({ loading: false, error: error.message })
    } else {
      set({ subjects: data || [], loading: false })
    }
  },

  create: async (subject) => {
    const user = useAuthStore.getState().user
    const payload = { ...subject, user_id: user.id }
    const tempId = crypto.randomUUID()

    set(s => ({ subjects: [...s.subjects, { ...payload, id: tempId, created_at: new Date().toISOString() }] }))

    const { data, error } = await supabase
      .from('subjects')
      .insert(payload)
      .select()
      .single()

    if (error) {
      set(s => ({
        subjects: s.subjects.filter(x => x.id !== tempId),
        error: error.message,
      }))
      return null
    }

    set(s => ({
      subjects: s.subjects.map(x => x.id === tempId ? data : x),
      error: null,
    }))
    return data
  },

  update: async (id, changes) => {
    const prev = get().subjects.find(s => s.id === id)
    set(s => ({
      subjects: s.subjects.map(x => x.id === id ? { ...x, ...changes } : x),
    }))

    const { data, error } = await supabase
      .from('subjects')
      .update(changes)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      set(s => ({
        subjects: s.subjects.map(x => x.id === id ? prev : x),
        error: error.message,
      }))
      return null
    }

    set(s => ({
      subjects: s.subjects.map(x => x.id === id ? data : x),
      error: null,
    }))
    return data
  },

  remove: async (id) => {
    const prev = get().subjects.find(s => s.id === id)
    set(s => ({ subjects: s.subjects.filter(x => x.id !== id) }))

    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', id)

    if (error) {
      set(s => ({
        subjects: [...s.subjects, prev],
        error: error.message,
      }))
    }
  },
}))

export default useSubjectStore
