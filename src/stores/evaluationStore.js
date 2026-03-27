import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import useAuthStore from './authStore'

const useEvaluationStore = create((set, get) => ({
  evaluations: [],
  loading: false,
  error: null,

  fetchBySubject: async (subjectId) => {
    set({ loading: true, error: null })
    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .eq('subject_id', subjectId)
      .order('eval_date', { ascending: true, nullsFirst: false })

    if (error) {
      set({ loading: false, error: error.message })
    } else {
      set({ evaluations: data || [], loading: false })
    }
  },

  fetchAll: async () => {
    set({ loading: true, error: null })
    const { data, error } = await supabase
      .from('evaluations')
      .select('*, subject:subjects(id, name, code)')
      .order('eval_date', { ascending: true, nullsFirst: false })

    if (error) {
      set({ loading: false, error: error.message })
    } else {
      set({ evaluations: data || [], loading: false })
    }
  },

  create: async (evaluation) => {
    const user = useAuthStore.getState().user
    const payload = { ...evaluation, user_id: user.id }
    const tempId = crypto.randomUUID()

    set(s => ({ evaluations: [...s.evaluations, { ...payload, id: tempId, created_at: new Date().toISOString() }] }))

    const { data, error } = await supabase
      .from('evaluations')
      .insert(payload)
      .select()
      .single()

    if (error) {
      set(s => ({
        evaluations: s.evaluations.filter(e => e.id !== tempId),
        error: error.message,
      }))
      return null
    }

    set(s => ({
      evaluations: s.evaluations.map(e => e.id === tempId ? data : e),
      error: null,
    }))
    return data
  },

  update: async (id, changes) => {
    const prev = get().evaluations.find(e => e.id === id)
    set(s => ({
      evaluations: s.evaluations.map(e => e.id === id ? { ...e, ...changes } : e),
    }))

    const { data, error } = await supabase
      .from('evaluations')
      .update(changes)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      set(s => ({
        evaluations: s.evaluations.map(e => e.id === id ? prev : e),
        error: error.message,
      }))
      return null
    }

    set(s => ({
      evaluations: s.evaluations.map(e => e.id === id ? data : e),
      error: null,
    }))
    return data
  },

  remove: async (id) => {
    const prev = get().evaluations.find(e => e.id === id)
    set(s => ({ evaluations: s.evaluations.filter(e => e.id !== id) }))

    const { error } = await supabase
      .from('evaluations')
      .delete()
      .eq('id', id)

    if (error) {
      set(s => ({
        evaluations: [...s.evaluations, prev],
        error: error.message,
      }))
    }
  },

  togglePin: async (id) => {
    const evaluation = get().evaluations.find(e => e.id === id)
    if (!evaluation) return
    await get().update(id, { pinned: !evaluation.pinned })
  },
}))

export default useEvaluationStore
