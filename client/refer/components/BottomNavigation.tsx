import { Home, Calendar, GraduationCap, Dumbbell, User } from 'lucide-react'

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const navItems = [
  { id: 'home', icon: Home, label: 'Trang chủ' },
  { id: 'schedule', icon: Calendar, label: 'Lịch học' },
  { id: 'lessons', icon: GraduationCap, label: 'Bài học' },
  { id: 'practice', icon: Dumbbell, label: 'Luyện tập' },
  { id: 'profile', icon: User, label: 'Cá nhân' }
]

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-200 px-2 py-2 z-50">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-red-50 text-red-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}