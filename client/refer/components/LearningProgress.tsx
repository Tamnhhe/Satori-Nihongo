import { Flame, Trophy, Clock } from 'lucide-react'
import { Card } from './ui/card'

export function LearningProgress() {
  return (
    <div className="px-6 pb-4">
      <Card className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Streak hiện tại</p>
            <div className="flex items-center gap-2 mt-1">
              <Flame className="w-6 h-6 text-orange-300" />
              <span className="text-2xl font-bold">7 ngày</span>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm opacity-90">XP hôm nay</p>
            <div className="flex items-center gap-2 mt-1">
              <Trophy className="w-5 h-5 text-yellow-300" />
              <span className="text-xl font-bold">120 XP</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm opacity-90 mb-2">
            <span>Tiến độ tuần này</span>
            <span>4/7 ngày</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-white h-2 rounded-full" style={{ width: '57%' }}></div>
          </div>
        </div>
      </Card>
    </div>
  )
}