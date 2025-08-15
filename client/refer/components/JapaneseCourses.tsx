import { Play, Clock, Users, Star } from 'lucide-react'
import { Card } from './ui/card'
import { Progress } from './ui/progress'

const courses = [
  {
    id: 1,
    title: "Tiếng Nhật N5",
    subtitle: "Cơ bản - Sơ cấp",
    image: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=400&h=200&fit=crop",
    progress: 85,
    duration: "8 tuần",
    lessons: 32,
    level: "N5",
    status: "Đang học",
    color: "from-green-400 to-emerald-500"
  },
  {
    id: 2,
    title: "Tiếng Nhật N4",
    subtitle: "Trung cấp sơ đẳng",
    image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=200&fit=crop",
    progress: 45,
    duration: "10 tuần",
    lessons: 40,
    level: "N4",
    status: "Đang học",
    color: "from-blue-400 to-cyan-500"
  },
  {
    id: 3,
    title: "Tiếng Nhật N3",
    subtitle: "Trung cấp",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=200&fit=crop",
    progress: 12,
    duration: "12 tuần",
    lessons: 48,
    level: "N3",
    status: "Sắp mở",
    color: "from-purple-400 to-violet-500"
  }
]

export function JapaneseCourses() {
  return (
    <div className="px-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Khóa học của bạn</h2>
        <button className="text-red-600 text-sm font-medium">Xem tất cả</button>
      </div>
      
      <div className="space-y-4">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <div className="flex">
              <div className="relative w-24 h-24 flex-shrink-0">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-30`}></div>
                <div className="absolute top-2 left-2">
                  <span className="bg-white/90 text-xs font-bold px-2 py-1 rounded-full">
                    {course.level}
                  </span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
              </div>
              
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="font-medium text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-500">{course.subtitle}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    course.status === 'Đang học' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {course.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{course.lessons} bài</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Tiến độ</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}