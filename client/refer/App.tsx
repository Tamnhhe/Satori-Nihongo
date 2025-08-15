import { useState } from 'react'
import { BottomNavigation } from './components/BottomNavigation'
import { JapaneseHeader } from './components/JapaneseHeader'
import { JapaneseProgress } from './components/JapaneseProgress'
import { JapaneseCourses } from './components/JapaneseCourses'
import { ScheduleScreen } from './components/ScheduleScreen'
import { LessonsScreen } from './components/LessonsScreen'
import { PracticeScreen } from './components/PracticeScreen'
import { ProfileScreen } from './components/ProfileScreen'
import { SimpleLoginScreen } from './components/SimpleLoginScreen'

function HomeScreen() {
  return (
    <div className="overflow-y-auto h-full pb-20">
      <JapaneseHeader />
      <JapaneseProgress />
      <JapaneseCourses />
      
      {/* Quick Actions */}
      <div className="px-6 py-4">
        <h3 className="font-semibold mb-3">Hành động nhanh</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-4 rounded-lg text-center">
            <div className="text-2xl mb-1">📝</div>
            <div className="text-sm">Luyện viết</div>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-lg text-center">
            <div className="text-2xl mb-1">🗣️</div>
            <div className="text-sm">Phát âm</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('home')

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />
      case 'schedule':
        return <ScheduleScreen />
      case 'lessons':
        return <LessonsScreen />
      case 'practice':
        return <PracticeScreen />
      case 'profile':
        return <ProfileScreen />
      default:
        return <HomeScreen />
    }
  }

  if (!isLoggedIn) {
    return <SimpleLoginScreen onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* iPhone Container */}
      <div className="max-w-sm mx-auto bg-white min-h-screen shadow-2xl relative">
        {/* iPhone Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10"></div>
        
        {/* Status Bar */}
        <div className="pt-8 pb-2 px-6">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">9:41</span>
            <div className="flex items-center gap-1">
              <div className="flex gap-1">
                <div className="w-1 h-3 bg-black rounded-full"></div>
                <div className="w-1 h-3 bg-black rounded-full"></div>
                <div className="w-1 h-3 bg-gray-300 rounded-full"></div>
                <div className="w-1 h-3 bg-gray-300 rounded-full"></div>
              </div>
              <div className="w-6 h-3 border border-black rounded-sm relative ml-1">
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-black rounded-full -mr-0.5"></div>
                <div className="w-4 h-2 bg-black rounded-sm m-0.5"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* App Content */}
        <div className="overflow-hidden h-full">
          {renderScreen()}
        </div>
        
        {/* Bottom Navigation */}
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  )
}