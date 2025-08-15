import { BarChart3, Settings, HelpCircle, LogOut, Edit, Award } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Progress } from './ui/progress'
import { UserProgress } from '../utils/auth'

const achievements = [
  { title: "Người mới bắt đầu", desc: "Hoàn thành bài học đầu tiên", icon: "🎯" },
  { title: "Kiên trì 7 ngày", desc: "Học liên tục 7 ngày", icon: "🔥" },
  { title: "Master Hiragana", desc: "Thuộc hết bảng Hiragana", icon: "📝" }
]

interface ProfileScreenProps {
  userProgress?: UserProgress | null
  onLogout?: () => Promise<void>
}

export function ProfileScreen({ userProgress, onLogout }: ProfileScreenProps) {
  const streak = userProgress?.streak || 15
  const totalXP = userProgress?.totalXP || 2450
  const wordsLearned = userProgress?.wordsLearned || 567
  const kanjiLearned = userProgress?.kanjiLearned || 89
  const currentLevel = userProgress?.currentLevel || 'N4'
  
  const statsData = [
    { label: "Ngày học liên tiếp", value: `${streak} ngày`, color: "text-orange-600" },
    { label: "Tổng XP kiếm được", value: `${totalXP.toLocaleString()} XP`, color: "text-purple-600" },
    { label: "Từ vựng đã học", value: `${wordsLearned} từ`, color: "text-blue-600" },
    { label: "Kanji đã nhớ", value: `${kanjiLearned} chữ`, color: "text-green-600" }
  ]

  const progressPercentage = Math.min(85, Math.floor((totalXP / 4000) * 100))

  const handleLogout = async () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      if (onLogout) {
        await onLogout()
      }
    }
  }

  return (
    <div className="p-6 pb-24">
      {/* User Profile Header */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" alt="User" />
            <AvatarFallback>TH</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">Trần Hoàng</h2>
            <p className="text-gray-600">Level {currentLevel} • Thành viên từ Jan 2024</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-gray-500">Tiến độ lên N3:</span>
              <div className="flex-1 max-w-24">
                <Progress value={progressPercentage} className="h-2" />
              </div>
              <span className="text-sm text-blue-600 font-medium">{progressPercentage}%</span>
            </div>
          </div>
          <Button size="sm" variant="outline">
            <Edit className="w-4 h-4 mr-1" />
            Sửa
          </Button>
        </div>
      </Card>

      {/* Statistics */}
      <Card className="p-6 mb-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Thống kê học tập
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {statsData.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Achievements */}
      <Card className="p-6 mb-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-600" />
          Thành tích
        </h3>
        <div className="space-y-3">
          {achievements.map((achievement, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl">{achievement.icon}</div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{achievement.title}</div>
                <div className="text-sm text-gray-600">{achievement.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Menu Options */}
      <div className="space-y-3">
        <Card className="p-4">
          <button className="flex items-center gap-3 w-full text-left">
            <Settings className="w-5 h-5 text-gray-600" />
            <span className="flex-1">Cài đặt</span>
            <span className="text-gray-400">›</span>
          </button>
        </Card>

        <Card className="p-4">
          <button className="flex items-center gap-3 w-full text-left">
            <HelpCircle className="w-5 h-5 text-gray-600" />
            <span className="flex-1">Hướng dẫn sử dụng</span>
            <span className="text-gray-400">›</span>
          </button>
        </Card>

        <Card className="p-4">
          <button 
            className="flex items-center gap-3 w-full text-left text-red-600"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            <span className="flex-1">Đăng xuất</span>
            <span className="text-red-400">›</span>
          </button>
        </Card>
      </div>
    </div>
  )
}