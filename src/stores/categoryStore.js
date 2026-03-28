import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import useAuthStore from './authStore'

const useCategoryStore = create((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null })
    const { data, error } = await supabase
      .from('evaluation_categories')
      .select('*')
      .order('sort_order')

    if (error) {
      set({ loading: false, error: error.message })
    } else {
      set({ categories: data || [], loading: false })
    }
  },

  fetchBySubject: async (subjectId) => {
    set({ loading: true, error: null })
    const { data, error } = await supabase
      .from('evaluation_categories')
      .select('*')
      .eq('subject_id', subjectId)
      .order('sort_order')

    if (error) {
      set({ loading: false, error: error.message })
    } else {
      set({ categories: data || [], loading: false })
    }
  },

  create: async ({ subject_id, name, weight }) => {
    const user = useAuthStore.getState().user
    const payload = { user_id: user.id, subject_id, name, weight }
    const tempId = crypto.randomUUID()

    set(s => ({ categories: [...s.categories, { ...payload, id: tempId, created_at: new Date().toISOString() }] }))

    const { data, error } = await supabase
      .from('evaluation_categories')
      .insert(payload)
      .select()
      .single()

    if (error) {
      set(s => ({
        categories: s.categories.filter(c => c.id !== tempId),
        error: error.message,
      }))
      return null
    }

    set(s => ({
      categories: s.categories.map(c => c.id === tempId ? data : c),
      error: null,
    }))
    return data
  },

  update: async (id, changes) => {
    const prev = get().categories.find(c => c.id === id)
    set(s => ({
      categories: s.categories.map(c => c.id === id ? { ...c, ...changes } : c),
    }))

    const { data, error } = await supabase
      .from('evaluation_categories')
      .update(changes)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      set(s => ({
        categories: s.categories.map(c => c.id === id ? prev : c),
        error: error.message,
      }))
      return null
    }

    set(s => ({
      categories: s.categories.map(c => c.id === id ? data : c),
      error: null,
    }))
    return data
  },

  remove: async (id) => {
    const prev = get().categories.find(c => c.id === id)
    set(s => ({ categories: s.categories.filter(c => c.id !== id) }))

    const { error } = await supabase
      .from('evaluation_categories')
      .delete()
      .eq('id', id)

    if (error) {
      set(s => ({
        categories: [...s.categories, prev],
        error: error.message,
      }))
    }
  },
}))

export default useCategoryStore
