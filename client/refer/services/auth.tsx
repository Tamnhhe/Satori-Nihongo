import { createClient } from '@supabase/supabase-js'
import { projectId, publicAnonKey } from '../utils/supabase/info'

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
)

export interface User {
  id: string
  email: string
  name: string
}

export interface UserProgress {
  level: string
  xp: number
  streak: number
  wordsLearned: number
  kanjiLearned: number
  lessonsCompleted: number
}

class AuthService {
  async signUp(email: string, password: string, name: string) {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-bf22d030/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password, name }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }
      
      return data.user
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      return {
        user: data.user,
        session: data.session,
        accessToken: data.session?.access_token
      }
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      
      return session
    } catch (error) {
      console.error('Get session error:', error)
      return null
    }
  }

  async getUserProgress(userId: string, accessToken: string): Promise<UserProgress | null> {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-bf22d030/progress/${userId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get progress')
      }
      
      return data.progress
    } catch (error) {
      console.error('Get progress error:', error)
      return null
    }
  }

  async updateUserProgress(userId: string, accessToken: string, progress: Partial<UserProgress>) {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-bf22d030/progress/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(progress),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update progress')
      }
      
      return data.progress
    } catch (error) {
      console.error('Update progress error:', error)
      throw error
    }
  }
}

export const authService = new AuthService()