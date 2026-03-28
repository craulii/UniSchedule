import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import useAuthStore from './authStore'

const useScheduleStore = create((set, get) => ({
  entries: [],
  loading: false,
  error: null,

  fetch: async () => {
    set({ loading: true, error: null })
    const { data, error } = await supabase
      .from('schedules')
      .select('*, subject:subjects(id, name, code)')
      .order('day')

    if (error) {
      set({ loading: false, error: error.message })
    } else {
      set({ entries: data || [], loading: false })
    }
  },

  getEntries: (day, blockKey) => {
    return get().entries.filter(e => e.day === day && e.block_key === blockKey)
  },

  assign: async ({ subject_id, day, block_key, room }) => {
    const user = useAuthStore.getState().user
    const payload = { user_id: user.id, subject_id, day, block_key, room: room || null }
    const tempId = crypto.randomUUID()

    set(s => ({ entries: [...s.entries, { ...payload, id: tempId }] }))

    const { data, error } = await supabase
      .from('schedules')
      .insert(payload)
      .select('*, subject:subjects(id, name, code)')
      .single()

    if (error) {
      set(s => ({
        entries: s.entries.filter(e => e.id !== tempId),
        error: error.message,
      }))
      return null
    }

    set(s => ({
      entries: s.entries.map(e => e.id === tempId ? data : e),
      error: null,
    }))
    return data
  },

  update: async (id, changes) => {
    const prev = get().entries.find(e => e.id === id)
    set(s => ({
      entries: s.entries.map(e => e.id === id ? { ...e, ...changes } : e),
    }))

    const { data, error } = await supabase
      .from('schedules')
      .update(changes)
      .eq('id', id)
      .select('*, subject:subjects(id, name, code)')
      .single()

    if (error) {
      set(s => ({
        entries: s.entries.map(e => e.id === id ? prev : e),
        error: error.message,
      }))
      return null
    }

    set(s => ({
      entries: s.entries.map(e => e.id === id ? data : e),
      error: null,
    }))
    return data
  },

  unassign: async (id) => {
    const prev = get().entries.find(e => e.id === id)
    set(s => ({ entries: s.entries.filter(e => e.id !== id) }))

    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', id)

    if (error) {
      set(s => ({
        entries: [...s.entries, prev],
        error: error.message,
      }))
    }
  },
}))

export default useScheduleStore
