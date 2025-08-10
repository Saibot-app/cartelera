import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, Database } from '../lib/supabase'

type UserProfile = Database['public']['Tables']['users']['Row']
type Company = Database['public']['Tables']['companies']['Row']

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  company: Company | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, companyName: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await loadUserProfile(session.user.id)
      } else {
        setUserProfile(null)
        setCompany(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (userId: string) => {
    try {
      // Primero obtener el perfil del usuario
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) {
        console.warn('User profile not found, attempting to create it:', profileError)
        
        // Try to get user email from auth
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user?.email) {
          // Try to create a basic profile - the user will need to set up company later
          await tryCreateUserProfile(user.id, user.email)
          
          // Try loading profile again
          const { data: newProfile, error: newProfileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single()
            
          if (newProfileError) {
            console.error('Still cannot load user profile after creation attempt:', newProfileError)
            setLoading(false)
            return
          }
          
          setUserProfile(newProfile)
          
          // Try to load company if profile has company_id
          if (newProfile.company_id) {
            const { data: companyData, error: companyError } = await supabase
              .from('companies')
              .select('*')
              .eq('id', newProfile.company_id)
              .single()

            if (companyError) {
              console.error('Error loading company:', companyError)
            } else {
              setCompany(companyData)
            }
          }
        } else {
          console.error('Cannot create profile without email')
          setLoading(false)
          return
        }
      } else {
        setUserProfile(profile)

        // Luego obtener la información de la empresa
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', profile.company_id)
          .single()

        if (companyError) {
          console.error('Error loading company:', companyError)
        } else {
          setCompany(companyData)
        }
      }

    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (error) {
      return { error: error instanceof Error ? error : new Error(String(error)) }
    }
  }

  const signUp = async (email: string, password: string, companyName: string) => {
    try {
      // Register user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error || !data.user) {
        return { error }
      }

      // Try to call edge function to setup company and user profile
      try {
        const { data: setupResult, error: setupError } = await supabase.functions.invoke('setup-company', {
          body: {
            userId: data.user.id,
            email: email,
            companyName: companyName
          }
        })

        if (setupError) {
          console.warn('Edge function failed, will setup on first login:', setupError)
          // Don't fail the signup - we'll handle this on first login
        }
      } catch (edgeFunctionError) {
        console.warn('Edge function not available, will setup on first login:', edgeFunctionError)
        // Edge function might not be deployed yet - handle this gracefully
      }

      return { error: null }

    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setUserProfile(null)
      setCompany(null)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error('No user logged in') }

    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)

    if (!error) {
      setUserProfile(prev => prev ? { ...prev, ...updates } : null)
    }

    return { error }
  }

  const tryCreateUserProfile = async (userId: string, email: string) => {
    try {
      // First, try to create a default company for this user
      const defaultCompanyName = `Empresa de ${email.split('@')[0]}`
      const slug = `empresa-${userId.slice(0, 8)}-${Date.now()}`
      
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: defaultCompanyName,
          slug: slug,
          subscription_status: 'trial'
        })
        .select()
        .single()

      if (companyError) {
        console.error('Error creating default company:', companyError)
        return
      }

      // Now create the user profile
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: email,
          company_id: company.id,
          role: 'admin'
        })

      if (userError) {
        console.error('Error creating user profile:', userError)
      } else {
        console.log('Successfully created user profile and company')
      }

    } catch (error) {
      console.error('Error in tryCreateUserProfile:', error)
    }
  }

  const value = {
    user,
    userProfile,
    company,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}