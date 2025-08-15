import { Bell, Search } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export function LearningHeader() {
  return (
    <div className="flex items-center justify-between p-6 bg-white">
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" alt="User" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm text-gray-500">Chào buổi sáng,</p>
          <p className="font-medium">John Doe</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="w-6 h-6 text-gray-400" />
        </div>
        <div className="relative">
          <Bell className="w-6 h-6 text-gray-400" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}