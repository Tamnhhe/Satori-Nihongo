import { Flame, Trophy } from 'lucide-react'
import { Card } from './ui/card'
import { UserProgress } from '../utils/auth'

interface JapaneseProgressProps {
  userProgress?: UserProgress | null
}

export function JapaneseProgress({ userProgress }: JapaneseProgressProps) {
  const streak = userProgress?.streak || 15
  const totalXP = userProgress?.totalXP || 2450
  const wordsLearned = userProgress?.wordsLearned || 567
  const kanjiLearned = userProgress?.kanjiLearned || 89
  const lessonsCompleted = userProgress?.lessonsCompleted || 24
  const currentLevel = userProgress?.currentLevel || 'N4'
  
  // Calculate progress to next level
  const progressPercentage = Math.min(65, Math.floor((totalXP / 4000) * 100))

  return (
    <div className="px-6 pb-4">
      <Card className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm opacity-90">Streak hiện tại</p>
            <div className="flex items-center gap-2 mt-1">
              <Flame className="w-6 h-6 text-orange-300" />
              <span className="text-2xl font-bold">{streak} ngày</span>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm opacity-90">Level {currentLevel}</p>
            <div className="flex items-center gap-2 mt-1">
              <Trophy className="w-5 h-5 text-yellow-300" />
              <span className="text-xl font-bold">{totalXP.toLocaleString()} XP</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center mb-1">
              <span className="text-2xl font-bold">{wordsLearned}</span>
            </div>
            <p className="text-xs opacity-80">Từ đã học</p>
          </div>
          <div>
            <div className="flex items-center justify-center mb-1">
              <span className="text-2xl font-bold">{kanjiLearned}</span>
            </div>
            <p className="text-xs opacity-80">Kanji đã nhớ</p>
          </div>
          <div>
            <div className="flex items-center justify-center mb-1">
              <span className="text-2xl font-bold">{lessonsCompleted}</span>
            </div>
            <p className="text-xs opacity-80">Bài đã hoàn thành</p>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm opacity-90 mb-2">
            <span>Tiến độ lên N3</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-white h-2 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>
      </Card>
    </div>
  )
}