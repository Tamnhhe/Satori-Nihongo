import { Video, Clock, Users, ChevronLeft, ChevronRight, MapPin, BookOpen, User } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { useState } from 'react'

// Time slots for the timetable
const timeSlots = [
  '08:00',
  '09:30',
  '11:00',
  '13:00',
  '14:30',
  '16:00',
  '17:30',
  '19:00'
]

// Days of the week
const daysOfWeek = [
  { short: 'T2', full: 'Thứ 2' },
  { short: 'T3', full: 'Thứ 3' },
  { short: 'T4', full: 'Thứ 4' },
  { short: 'T5', full: 'Thứ 5' },
  { short: 'T6', full: 'Thứ 6' },
  { short: 'T7', full: 'Thứ 7' },
  { short: 'CN', full: 'Chủ nhật' }
]

// Sample timetable data
const timetableData = {
  'T2': {
    '08:00': {
      id: 1,
      title: 'Ngữ pháp N5',
      teacher: 'Sensei Tanaka',
      level: 'N5',
      type: 'Ngữ pháp',
      room: 'Phòng A1',
      duration: '90 phút',
      status: 'scheduled',
      meetLink: 'https://meet.google.com/abc-defg-hij',
      participants: 15,
      description: 'Học về cách sử dụng trợ từ は và を trong câu tiếng Nhật cơ bản',
      lesson: 'Bài 12: Trợ từ cơ bản'
    },
    '14:30': {
      id: 2,
      title: 'Kanji N4',
      teacher: 'Sensei Yamada',
      level: 'N4',
      type: 'Kanji',
      room: 'Phòng B2',
      duration: '60 phút',
      status: 'scheduled',
      meetLink: 'https://meet.google.com/xyz-uvwx-yzb',
      participants: 12,
      description: 'Học cách viết và đọc 20 chữ Kanji về chủ đề gia đình',
      lesson: 'Bài 8: Kanji về gia đình'
    }
  },
  'T3': {
    '09:30': {
      id: 3,
      title: 'Hội thoại N5',
      teacher: 'Sensei Sato',
      level: 'N5',
      type: 'Hội thoại',
      room: 'Phòng C1',
      duration: '90 phút',
      status: 'live',
      meetLink: 'https://meet.google.com/def-ghij-klm',
      participants: 8,
      description: 'Luyện tập hội thoại về chủ đề mua sắm và hỏi giá',
      lesson: 'Bài 15: Mua sắm cơ bản'
    },
    '16:00': {
      id: 4,
      title: 'Từ vựng N3',
      teacher: 'Sensei Takahashi',
      level: 'N3',
      type: 'Từ vựng',
      room: 'Phòng A2',
      duration: '60 phút',
      status: 'upcoming',
      meetLink: 'https://meet.google.com/nop-qrst-uvw',
      participants: 18,
      description: 'Mở rộng vốn từ vựng về môi trường và thiên nhiên',
      lesson: 'Bài 22: Từ vựng về môi trường'
    }
  },
  'T4': {
    '11:00': {
      id: 5,
      title: 'Nghe hiểu N4',
      teacher: 'Sensei Ito',
      level: 'N4',
      type: 'Nghe hiểu',
      room: 'Phòng B1',
      duration: '60 phút',
      status: 'scheduled',
      meetLink: 'https://meet.google.com/ghi-jklm-nop',
      participants: 14,
      description: 'Luyện nghe hiểu các tình huống giao tiếp hàng ngày',
      lesson: 'Bài 10: Nghe hiểu tình huống'
    },
    '19:00': {
      id: 6,
      title: 'Ngữ pháp N2',
      teacher: 'Sensei Watanabe',
      level: 'N2',
      type: 'Ngữ pháp',
      room: 'Phòng C2',
      duration: '90 phút',
      status: 'scheduled',
      meetLink: 'https://meet.google.com/qrs-tuvw-xyz',
      participants: 10,
      description: 'Học về các mẫu câu phức tạp và cách diễn đạt ý kiến',
      lesson: 'Bài 25: Mẫu câu diễn đạt ý kiến'
    }
  },
  'T5': {
    '08:00': {
      id: 7,
      title: 'Kanji N3',
      teacher: 'Sensei Suzuki',
      level: 'N3',
      type: 'Kanji',
      room: 'Phòng A3',
      duration: '90 phút',
      status: 'scheduled',
      meetLink: 'https://meet.google.com/abc-123-def',
      participants: 16,
      description: 'Học cách đọc và viết Kanji về các hoạt động xã hội',
      lesson: 'Bài 18: Kanji về xã hội'
    },
    '17:30': {
      id: 8,
      title: 'Đọc hiểu N1',
      teacher: 'Sensei Kimura',
      level: 'N1',
      type: 'Đọc hiểu',
      room: 'Phòng D1',
      duration: '90 phút',
      status: 'scheduled',
      meetLink: 'https://meet.google.com/456-ghi-789',
      participants: 6,
      description: 'Phân tích và hiểu sâu các văn bản học thuật',
      lesson: 'Bài 30: Đọc hiểu văn bản học thuật'
    }
  },
  'T6': {
    '13:00': {
      id: 9,
      title: 'Hội thoại N2',
      teacher: 'Sensei Nakamura',
      level: 'N2',
      type: 'Hội thoại',
      room: 'Phòng B3',
      duration: '90 phút',
      status: 'scheduled',
      meetLink: 'https://meet.google.com/jkl-mno-pqr',
      participants: 9,
      description: 'Thảo luận về các chủ đề xã hội và văn hóa',
      lesson: 'Bài 20: Thảo luận xã hội'
    }
  },
  'T7': {
    '09:30': {
      id: 10,
      title: 'Ôn tập N5',
      teacher: 'Sensei Hayashi',
      level: 'N5',
      type: 'Ôn tập',
      room: 'Phòng E1',
      duration: '120 phút',
      status: 'scheduled',
      meetLink: 'https://meet.google.com/stu-vwx-yza',
      participants: 20,
      description: 'Tổng ôn lại toàn bộ kiến thức N5 chuẩn bị cho kỳ thi',
      lesson: 'Ôn tập tổng hợp N5'
    },
    '14:30': {
      id: 11,
      title: 'Kiểm tra N4',
      teacher: 'Sensei Ogawa',
      level: 'N4',
      type: 'Kiểm tra',
      room: 'Phòng F1',
      duration: '90 phút',
      status: 'scheduled',
      meetLink: 'https://meet.google.com/bcd-efg-hij',
      participants: 13,
      description: 'Kiểm tra giữa khóa các kỹ năng đã học',
      lesson: 'Kiểm tra giữa kỳ N4'
    }
  },
  'CN': {
    '10:00': {
      id: 12,
      title: 'Văn hóa Nhật Bản',
      teacher: 'Sensei Matsui',
      level: 'All',
      type: 'Văn hóa',
      room: 'Phòng G1',
      duration: '60 phút',
      status: 'scheduled',
      meetLink: 'https://meet.google.com/klm-nop-qrs',
      participants: 25,
      description: 'Tìm hiểu về lễ hội truyền thống và phong tục Nhật Bản',
      lesson: 'Chủ đề: Lễ hội mùa xuân'
    }
  }
}

export function ScheduleScreen() {
  const [currentWeek, setCurrentWeek] = useState(0)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson)
    setIsDialogOpen(true)
  }

  const handleJoinMeeting = (meetLink: string) => {
    window.open(meetLink, '_blank')
    setIsDialogOpen(false)
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'N5': return 'bg-green-100 text-green-700 border-green-200'
      case 'N4': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'N3': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'N2': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'N1': return 'bg-red-100 text-red-700 border-red-200'
      case 'All': return 'bg-purple-100 text-purple-700 border-purple-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-red-500'
      case 'upcoming': return 'bg-green-500'
      case 'scheduled': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'live': return 'Đang diễn ra'
      case 'upcoming': return 'Sắp bắt đầu'
      case 'scheduled': return 'Đã lên lịch'
      default: return ''
    }
  }

  const formatDate = (dayOffset: number) => {
    const today = new Date()
    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() + dayOffset + (currentWeek * 7))
    return targetDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
  }

  return (
    <div className="p-4 pb-24">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-bold text-gray-900">Thời khóa biểu</h1>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentWeek(currentWeek - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm px-3 py-1 bg-gray-100 rounded">
              Tuần {currentWeek === 0 ? 'này' : currentWeek > 0 ? `+${currentWeek}` : currentWeek}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentWeek(currentWeek + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Timetable */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Header with days */}
          <div className="grid grid-cols-8 gap-1 mb-2">
            <div className="p-2 text-center">
              <span className="text-sm text-gray-600">Giờ</span>
            </div>
            {daysOfWeek.map((day, index) => (
              <div key={day.short} className="p-2 text-center bg-gray-50 rounded">
                <div className="font-medium text-xs">{day.short}</div>
                <div className="text-xs text-gray-600">{formatDate(index)}</div>
              </div>
            ))}
          </div>

          {/* Time slots and classes */}
          {timeSlots.map((time) => (
            <div key={time} className="grid grid-cols-8 gap-1 mb-1">
              {/* Time column */}
              <div className="p-2 text-center bg-gray-50 rounded flex items-center justify-center">
                <span className="text-xs font-medium text-gray-700">{time}</span>
              </div>

              {/* Day columns */}
              {daysOfWeek.map((day) => {
                const lesson = timetableData[day.short]?.[time]
                
                return (
                  <div key={`${day.short}-${time}`} className="relative">
                    {lesson ? (
                      <Card className={`p-2 h-20 ${getLevelColor(lesson.level)} border cursor-pointer hover:shadow-md transition-shadow`}
                            onClick={() => handleLessonClick(lesson)}>
                        {/* Status indicator */}
                        <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${getStatusColor(lesson.status)}`}></div>
                        
                        <div className="flex flex-col h-full justify-between">
                          <div>
                            <div className="font-medium text-xs truncate">{lesson.title}</div>
                            <div className="text-xs text-gray-600 truncate">{lesson.teacher}</div>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-xs px-1 py-0">
                              {lesson.level}
                            </Badge>
                            <div className="text-xs text-gray-500 flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              {lesson.participants}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ) : (
                      <div className="h-20 border border-gray-100 rounded bg-gray-25"></div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-3 text-sm">Chú thích</h3>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Đang diễn ra</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Sắp bắt đầu</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Đã lên lịch</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-200 border border-green-300 rounded"></div>
              <span>N5 (Cơ bản)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-200 border border-blue-300 rounded"></div>
              <span>N4-N3 (Trung cấp)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-200 border border-red-300 rounded"></div>
              <span>N2-N1 (Nâng cao)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`${selectedLesson ? getLevelColor(selectedLesson.level) : ''} px-2 py-1`}>
                {selectedLesson?.level}
              </Badge>
              <Badge className={`px-2 py-1 ${selectedLesson ? getStatusColor(selectedLesson.status) : ''} text-white`}>
                {selectedLesson ? getStatusText(selectedLesson.status) : ''}
              </Badge>
            </div>
            <DialogTitle className="text-left">{selectedLesson?.title}</DialogTitle>
            <DialogDescription className="text-left text-sm text-gray-600">
              {selectedLesson?.lesson}
            </DialogDescription>
          </DialogHeader>
          
          {selectedLesson && (
            <div className="space-y-4">
              {/* Lesson Description */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm">{selectedLesson.description}</p>
              </div>

              {/* Lesson Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="text-gray-500">Giáo viên</div>
                    <div className="font-medium">{selectedLesson.teacher}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="text-gray-500">Thời gian</div>
                    <div className="font-medium">{selectedLesson.duration}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="text-gray-500">Phòng học</div>
                    <div className="font-medium">{selectedLesson.room}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="text-gray-500">Học viên</div>
                    <div className="font-medium">{selectedLesson.participants} người</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Đóng
                </Button>
                <Button 
                  className={`flex-1 ${
                    selectedLesson.status === 'live' 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : selectedLesson.status === 'upcoming'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  onClick={() => handleJoinMeeting(selectedLesson.meetLink)}
                >
                  <Video className="w-4 h-4 mr-2" />
                  {selectedLesson.status === 'live' ? 'Tham gia ngay' : 'Vào lớp học'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}