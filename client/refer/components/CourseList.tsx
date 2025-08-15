import { Play, Clock, Users } from 'lucide-react'
import { Card } from './ui/card'
import { Progress } from './ui/progress'

const courses = [
  {
    id: 1,
    title: "Tiếng Anh Giao Tiếp",
    subtitle: "Cơ bản đến nâng cao",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=200&fit=crop",
    progress: 65,
    duration: "4h 30m",
    lessons: 24,
    color: "from-green-400 to-blue-500"
  },
  {
    id: 2,
    title: "Toán Học THPT",
    subtitle: "Đại số và Hình học",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop",
    progress: 32,
    duration: "6h 15m",
    lessons: 36,
    color: "from-purple-400 to-pink-500"
  },
  {
    id: 3,
    title: "Lập Trình Python",
    subtitle: "Từ cơ bản đến nâng cao",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=200&fit=crop",
    progress: 78,
    duration: "8h 45m",
    lessons: 42,
    color: "from-yellow-400 to-orange-500"
  }
]

export function CourseList() {
  return (
    <div className="px-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Khóa học của bạn</h2>
        <button className="text-blue-500 text-sm">Xem tất cả</button>
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
                <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-20`}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
              </div>
              
              <div className="flex-1 p-4">
                <h3 className="font-medium text-gray-900">{course.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{course.subtitle}</p>
                
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