import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import * as kv from './kv_store.tsx'

const app = new Hono()

// Add CORS and logging middleware
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://*.vercel.app'],
  credentials: true,
}))
app.use('*', logger(console.log))

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

// Authentication Routes
app.post('/make-server-bf22d030/auth/signup', async (c) => {
  try {
    const { email, password, name, level } = await c.req.json()
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name, 
        level: level || 'N5',
        joinDate: new Date().toISOString(),
        streak: 0,
        totalXP: 0
      },
      email_confirm: true
    })

    if (error) {
      console.log('Signup error:', error)
      return c.json({ error: error.message }, 400)
    }

    // Initialize user progress in KV store
    const userId = data.user.id
    await kv.set(`user_progress_${userId}`, {
      streak: 0,
      totalXP: 0,
      wordsLearned: 0,
      kanjiLearned: 0,
      lessonsCompleted: 0,
      currentLevel: level || 'N5',
      achievements: []
    })

    return c.json({ user: data.user })
  } catch (error) {
    console.log('Signup error:', error)
    return c.json({ error: 'Internal server error during signup' }, 500)
  }
})

// Get user progress
app.get('/make-server-bf22d030/user/progress', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const progress = await kv.get(`user_progress_${user.id}`)
    return c.json({ progress: progress || {} })
  } catch (error) {
    console.log('Get progress error:', error)
    return c.json({ error: 'Error fetching user progress' }, 500)
  }
})

// Update user progress
app.post('/make-server-bf22d030/user/progress', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const progressUpdate = await c.req.json()
    const currentProgress = await kv.get(`user_progress_${user.id}`) || {}
    
    const updatedProgress = { ...currentProgress, ...progressUpdate }
    await kv.set(`user_progress_${user.id}`, updatedProgress)
    
    return c.json({ progress: updatedProgress })
  } catch (error) {
    console.log('Update progress error:', error)
    return c.json({ error: 'Error updating user progress' }, 500)
  }
})

// Get courses data
app.get('/make-server-bf22d030/courses', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const courses = await kv.get('courses_data') || [
      {
        id: 1,
        title: "Tiếng Nhật N5",
        subtitle: "Cơ bản - Sơ cấp",
        level: "N5",
        duration: "8 tuần",
        lessons: 32,
        status: "active"
      },
      {
        id: 2,
        title: "Tiếng Nhật N4", 
        subtitle: "Trung cấp sơ đẳng",
        level: "N4",
        duration: "10 tuần",
        lessons: 40,
        status: "active"
      }
    ]

    return c.json({ courses })
  } catch (error) {
    console.log('Get courses error:', error)
    return c.json({ error: 'Error fetching courses' }, 500)
  }
})

// Get schedule data
app.get('/make-server-bf22d030/schedule', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const schedule = await kv.get(`user_schedule_${user.id}`) || [
      {
        id: 1,
        title: "Ngữ pháp N5 - Bài 12",
        time: "09:00 - 10:30",
        date: "Hôm nay",
        teacher: "Sensei Tanaka",
        type: "Ngữ pháp",
        status: "live",
        meetLink: "https://meet.google.com/abc-defg-hij",
        participants: 15
      }
    ]

    return c.json({ schedule })
  } catch (error) {
    console.log('Get schedule error:', error)
    return c.json({ error: 'Error fetching schedule' }, 500)
  }
})

// Get lessons data
app.get('/make-server-bf22d030/lessons/:courseId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const courseId = c.req.param('courseId')
    const lessons = await kv.get(`lessons_${courseId}`) || []
    
    return c.json({ lessons })
  } catch (error) {
    console.log('Get lessons error:', error)
    return c.json({ error: 'Error fetching lessons' }, 500)
  }
})

// Get flashcards for practice
app.get('/make-server-bf22d030/flashcards/:level', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const level = c.req.param('level')
    const flashcards = await kv.get(`flashcards_${level}`) || [
      { front: 'こんにちは', back: 'Xin chào', romaji: 'konnichiwa' },
      { front: 'ありがとう', back: 'Cảm ơn', romaji: 'arigatou' },
      { front: 'すみません', back: 'Xin lỗi', romaji: 'sumimasen' }
    ]
    
    return c.json({ flashcards })
  } catch (error) {
    console.log('Get flashcards error:', error)
    return c.json({ error: 'Error fetching flashcards' }, 500)
  }
})

// Update lesson progress
app.post('/make-server-bf22d030/lessons/progress', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { lessonId, progress, completed } = await c.req.json()
    
    const userProgress = await kv.get(`user_progress_${user.id}`) || {}
    const lessonProgress = userProgress.lessonProgress || {}
    
    lessonProgress[lessonId] = { progress, completed, updatedAt: new Date().toISOString() }
    
    if (completed) {
      userProgress.lessonsCompleted = (userProgress.lessonsCompleted || 0) + 1
      userProgress.totalXP = (userProgress.totalXP || 0) + 50 // Award XP for completion
    }
    
    userProgress.lessonProgress = lessonProgress
    await kv.set(`user_progress_${user.id}`, userProgress)
    
    return c.json({ success: true, progress: userProgress })
  } catch (error) {
    console.log('Update lesson progress error:', error)
    return c.json({ error: 'Error updating lesson progress' }, 500)
  }
})

Deno.serve(app.fetch)