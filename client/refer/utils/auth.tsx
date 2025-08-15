import { createClient } from '@supabase/supabase-js'
import { projectId, publicAnonKey } from './supabase/info'

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
)

export interface User {
  id: string
  email: string
  name: string
  level: string
  joinDate: string
}

export interface UserProgress {
  streak: number
  totalXP: number
  wordsLearned: number
  kanjiLearned: number
  lessonsCompleted: number
  currentLevel: string
  achievements: string[]
  lessonProgress?: Record<string, { progress: number; completed: boolean }>
}

class AuthService {
  private apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-bf22d030`

  async signUp(email: string, password: string, name: string, level: string = 'N5') {
    try {
      const response = await fetch(`${this.apiUrl}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email, password, name, level })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Signup failed')
      }

      return data
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  async getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  }

  async getUserProgress(): Promise<UserProgress | null> {
    try {
      const session = await this.getCurrentSession()
      if (!session) return null

      const response = await fetch(`${this.apiUrl}/user/progress`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      const data = await response.json()
      if (!response.ok) {
        console.error('Error fetching user progress:', data.error)
        return null
      }

      return data.progress
    } catch (error) {
      console.error('Get user progress error:', error)
      return null
    }
  }

  async updateProgress(progressUpdate: Partial<UserProgress>): Promise<UserProgress | null> {
    try {
      const session = await this.getCurrentSession()
      if (!session) return null

      const response = await fetch(`${this.apiUrl}/user/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(progressUpdate)
      })

      const data = await response.json()
      if (!response.ok) {
        console.error('Error updating user progress:', data.error)
        return null
      }

      return data.progress
    } catch (error) {
      console.error('Update progress error:', error)
      return null
    }
  }

  async getCourses() {
    try {
      const session = await this.getCurrentSession()
      if (!session) return []

      const response = await fetch(`${this.apiUrl}/courses`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      const data = await response.json()
      if (!response.ok) {
        console.error('Error fetching courses:', data.error)
        return []
      }

      return data.courses
    } catch (error) {
      console.error('Get courses error:', error)
      return []
    }
  }

  async getSchedule() {
    try {
      const session = await this.getCurrentSession()
      if (!session) return []

      const response = await fetch(`${this.apiUrl}/schedule`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      const data = await response.json()
      if (!response.ok) {
        console.error('Error fetching schedule:', data.error)
        return []
      }

      return data.schedule
    } catch (error) {
      console.error('Get schedule error:', error)
      return []
    }
  }

  async getFlashcards(level: string) {
    try {
      const session = await this.getCurrentSession()
      if (!session) return []

      const response = await fetch(`${this.apiUrl}/flashcards/${level}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      const data = await response.json()
      if (!response.ok) {
        console.error('Error fetching flashcards:', data.error)
        return []
      }

      return data.flashcards
    } catch (error) {
      console.error('Get flashcards error:', error)
      return []
    }
  }
}

export const authService = new AuthService()