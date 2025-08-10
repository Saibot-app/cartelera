import { useState, useEffect } from 'react'
import { supabase, Tables } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

type Screen = Tables<'screens'>

export function useScreens() {
  const [screens, setScreens] = useState<Screen[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { company } = useAuth()

  useEffect(() => {
    if (company) {
      fetchScreens()
    }
  }, [company])

  const fetchScreens = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('screens')
        .select('*')
        .eq('company_id', company!.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setScreens(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching screens')
    } finally {
      setLoading(false)
    }
  }

  const addScreen = async (screenData: Omit<Screen, 'id' | 'company_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('screens')
        .insert({
          ...screenData,
          company_id: company!.id
        })
        .select()
        .single()

      if (error) throw error
      setScreens(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Error adding screen'
      return { data: null, error }
    }
  }

  const updateScreen = async (id: string, updates: Partial<Screen>) => {
    try {
      const { data, error } = await supabase
        .from('screens')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setScreens(prev => prev.map(s => s.id === id ? data : s))
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Error updating screen'
      return { data: null, error }
    }
  }

  const deleteScreen = async (id: string) => {
    try {
      const { error } = await supabase
        .from('screens')
        .delete()
        .eq('id', id)

      if (error) throw error
      setScreens(prev => prev.filter(s => s.id !== id))
      return { error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Error deleting screen'
      return { error }
    }
  }

  return {
    screens,
    loading,
    error,
    refetch: fetchScreens,
    addScreen,
    updateScreen,
    deleteScreen
  }
}