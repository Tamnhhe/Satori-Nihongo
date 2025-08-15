import { Play, FileText, CheckCircle, Lock, Clock } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { UserProgress } from '../utils/auth'

const lessonsData = [
  {
    id: 1,
    title: "Bài 1: Giới thiệu bản thân",
    duration: "25 phút",
    type: "Video + Slide",
    status: "completed",
    progress: 100,
    videoUrl: "https://example.com/video1",
    slideUrl: "https://example.com/slide1",
    description: "Học cách giới thiệu bản thân bằng tiếng Nhật"
  },
  {
    id: 2, 
    title: "Bài 2: Số đếm và thời gian",
    duration: "30 phút",
    type: "Video + Slide",
    status: "in-progress",
    progress: 65,
    videoUrl: "https://example.com/video2",
    slideUrl: "https://example.com/slide2",
    description: "Học cách đếm số và nói về thời gian"
  },
  {
    id: 3,
    title: "Bài 3: Gia đình và người thân",
    duration: "35 phút", 
    type: "Video + Slide",
    status: "available",
    progress: 0,
    videoUrl: "https://example.com/video3",
    slideUrl: "https://example.com/slide3",
    description: "Từ vựng về gia đình và cách nói về người thân"
  },
  {
    id: 4,
    title: "Bài 4: Đi mua sắm",
    duration: "40 phút",
    type: "Video + Slide", 
    status: "locked",
    progress: 0,
    videoUrl: "",
    slideUrl: "",
    description: "Hội thoại tại cửa hàng và từ vựng mua sắm"
  }
]

interface LessonsScreenProps {
  onProgressUpdate?: (progress: Partial<UserProgress>) => Promise<void>
}

export function LessonsScreen({ onProgressUpdate }: LessonsScreenProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'in-progress': return <Play className="w-5 h-5 text-blue-600" />
      case 'available': return <Play className="w-5 h-5 text-gray-600" />
      case 'locked': return <Lock className="w-5 h-5 text-gray-400" />
      default: return null
    }
  }

  const handleWatchVideo = async (videoUrl: string, lessonId: number) => {
    if (videoUrl) {
      window.open(videoUrl, '_blank')
      
      // Update progress when watching video
      if (onProgressUpdate) {
        await onProgressUpdate({
          totalXP: 25 // Add XP for watching video
        })
      }
    }
  }

  const handleViewSlide = async (slideUrl: string, lessonId: number) => {
    if (slideUrl) {
      window.open(slideUrl, '_blank')
      
      // Update progress when viewing slide
      if (onProgressUpdate) {
        await onProgressUpdate({
          totalXP: 15 // Add XP for viewing slides
        })
      }
    }
  }

  return (
    <div className="p-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Bài học</h1>
        <p className="text-gray-600">Xem video bài giảng và tài liệu học tập</p>
      </div>

      <div className="mb-6">
        <Card className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white">
          <h3 className="font-semibold mb-2">Khóa N5 - Cơ bản</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Tiến độ khóa học</span>
            <span className="text-sm">2/32 bài</span>
          </div>
          <Progress value={15} className="h-2 bg-white/20" />
        </Card>
      </div>

      <div className="space-y-4">
        {lessonsData.map((lesson) => (
          <Card key={lesson.id} className={`p-4 ${lesson.status === 'locked' ? 'opacity-60' : ''}`}>
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {getStatusIcon(lesson.status)}
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{lesson.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{lesson.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{lesson.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    <span>{lesson.type}</span>
                  </div>
                </div>

                {lesson.status !== 'locked' && lesson.progress > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Tiến độ</span>
                      <span>{lesson.progress}%</span>
                    </div>
                    <Progress value={lesson.progress} className="h-2" />
                  </div>
                )}

                {lesson.status !== 'locked' && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleWatchVideo(lesson.videoUrl, lesson.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Video
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewSlide(lesson.slideUrl, lesson.id)}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Slide
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}