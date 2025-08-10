import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos generados automáticamente basados en el schema actual
export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          slug: string
          subscription_status: 'trial' | 'active' | 'cancelled' | 'past_due'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          subscription_status?: 'trial' | 'active' | 'cancelled' | 'past_due'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          subscription_status?: 'trial' | 'active' | 'cancelled' | 'past_due'
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          company_id: string
          role: 'admin' | 'editor' | 'viewer'
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          company_id: string
          role?: 'admin' | 'editor' | 'viewer'
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          company_id?: string
          role?: 'admin' | 'editor' | 'viewer'
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      screens: {
        Row: {
          id: string
          name: string
          location: string
          resolution: string
          company_id: string
          status: 'online' | 'offline' | 'maintenance'
          last_ping: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          location: string
          resolution: string
          company_id: string
          status?: 'online' | 'offline' | 'maintenance'
          last_ping?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: string
          resolution?: string
          company_id?: string
          status?: 'online' | 'offline' | 'maintenance'
          last_ping?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      content: {
        Row: {
          id: string
          title: string
          type: 'image' | 'video' | 'text' | 'html'
          url: string | null
          text_content: string | null
          duration: number
          company_id: string
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          type: 'image' | 'video' | 'text' | 'html'
          url?: string | null
          text_content?: string | null
          duration: number
          company_id: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          type?: 'image' | 'video' | 'text' | 'html'
          url?: string | null
          text_content?: string | null
          duration?: number
          company_id?: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      playlists: {
        Row: {
          id: string
          name: string
          description: string | null
          company_id: string
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          company_id: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          company_id?: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      playlist_items: {
        Row: {
          id: string
          playlist_id: string
          content_id: string
          order_index: number
          company_id: string
          created_at: string
        }
        Insert: {
          id?: string
          playlist_id: string
          content_id: string
          order_index: number
          company_id: string
          created_at?: string
        }
        Update: {
          id?: string
          playlist_id?: string
          content_id?: string
          order_index?: number
          company_id?: string
          created_at?: string
        }
      }
      schedules: {
        Row: {
          id: string
          playlist_id: string
          screen_id: string
          start_time: string
          end_time: string
          days_of_week: string[]
          company_id: string
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          playlist_id: string
          screen_id: string
          start_time: string
          end_time: string
          days_of_week: string[]
          company_id: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          playlist_id?: string
          screen_id?: string
          start_time?: string
          end_time?: string
          days_of_week?: string[]
          company_id?: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]