import { Bell, Search } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export function JapaneseHeader() {
  return (
    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-red-600 to-pink-600 text-white">
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10 ring-2 ring-white/30">
          <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" alt="User" />
          <AvatarFallback className="bg-white/20 text-white">TH</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm opacity-90">おはよう (Ohayou),</p>
          <p className="font-medium">Trần Hoàng</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="w-6 h-6 opacity-80" />
        </div>
        <div className="relative">
          <Bell className="w-6 h-6 opacity-80" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}