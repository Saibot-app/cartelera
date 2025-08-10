import { useState, useEffect } from 'react'
import { supabase, Tables } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

type Content = Tables<'content'>

export function useContent() {
  const [content, setContent] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { company } = useAuth()

  useEffect(() => {
    if (company) {
      fetchContent()
    }
  }, [company])

  const fetchContent = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('company_id', company!.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setContent(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching content')
    } finally {
      setLoading(false)
    }
  }

  const addContent = async (contentData: Omit<Content, 'id' | 'company_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('content')
        .insert({
          ...contentData,
          company_id: company!.id
        })
        .select()
        .single()

      if (error) throw error
      setContent(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Error adding content'
      return { data: null, error }
    }
  }

  const updateContent = async (id: string, updates: Partial<Content>) => {
    try {
      const { data, error } = await supabase
        .from('content')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setContent(prev => prev.map(c => c.id === id ? data : c))
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Error updating content'
      return { data: null, error }
    }
  }

  const deleteContent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', id)

      if (error) throw error
      setContent(prev => prev.filter(c => c.id !== id))
      return { error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Error deleting content'
      return { error }
    }
  }

  return {
    content,
    loading,
    error,
    refetch: fetchContent,
    addContent,
    updateContent,
    deleteContent
  }
}