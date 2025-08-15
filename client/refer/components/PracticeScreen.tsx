import { useState } from 'react'
import { RotateCcw, Zap, Target, BookOpen, Languages, Dumbbell } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { AlphabetScreen } from './AlphabetScreen'
import { UserProgress } from '../utils/auth'

const flashcardData = [
  { front: 'こんにちは', back: 'Xin chào', romaji: 'konnichiwa' },
  { front: 'ありがとう', back: 'Cảm ơn', romaji: 'arigatou' },
  { front: 'すみません', back: 'Xin lỗi', romaji: 'sumimasen' },
  { front: 'はじめまして', back: 'Rất vui được gặp bạn', romaji: 'hajimemashite' }
]

const practiceCategories = [
  {
    id: 1,
    title: "Flashcard Từ vựng N5",
    description: "Ôn tập từ vựng cơ bản với flashcard",
    icon: RotateCcw,
    count: "150 từ",
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: 2,
    title: "Quiz Ngữ pháp N5",
    description: "Kiểm tra kiến thức ngữ pháp",
    icon: Zap,
    count: "50 câu hỏi",
    color: "from-green-500 to-emerald-600"
  },
  {
    id: 3,
    title: "Luyện Kanji",
    description: "Nhận biết và viết Kanji",
    icon: BookOpen,
    count: "80 chữ",
    color: "from-purple-500 to-violet-600"
  },
  {
    id: 4,
    title: "Test Đánh giá",
    description: "Kiểm tra tổng hợp kiến thức",
    icon: Target,
    count: "100 câu",
    color: "from-red-500 to-pink-600"
  }
]

interface PracticeScreenProps {
  userProgress?: UserProgress | null
  onProgressUpdate?: (progress: Partial<UserProgress>) => Promise<void>
}

function FlashcardDemo({ onProgressUpdate }: { onProgressUpdate?: (progress: Partial<UserProgress>) => Promise<void> }) {
  const [currentCard, setCurrentCard] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const nextCard = async () => {
    setCurrentCard((prev) => (prev + 1) % flashcardData.length)
    setIsFlipped(false)
    
    // Award XP for practicing flashcard
    if (onProgressUpdate) {
      await onProgressUpdate({
        totalXP: 5,
        wordsLearned: 1
      })
    }
  }

  const flipCard = () => {
    setIsFlipped(!isFlipped)
  }

  const card = flashcardData[currentCard]

  return (
    <Card className="p-6 mb-6">
      <h3 className="font-semibold mb-4 text-center">Demo Flashcard</h3>
      
      <div 
        className="relative w-full h-48 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105"
        onClick={flipCard}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
          {!isFlipped ? (
            <>
              <div className="text-3xl font-bold mb-2">{card.front}</div>
              <div className="text-sm opacity-80">{card.romaji}</div>
            </>
          ) : (
            <div className="text-xl font-medium text-center">{card.back}</div>
          )}
        </div>
        
        <div className="absolute bottom-2 right-2 text-white text-xs opacity-70">
          {currentCard + 1}/{flashcardData.length}
        </div>
      </div>
      
      <div className="flex justify-center mt-4 gap-2">
        <Button variant="outline" size="sm" onClick={flipCard}>
          Lật thẻ
        </Button>
        <Button size="sm" onClick={nextCard}>
          Tiếp theo
        </Button>
      </div>
    </Card>
  )
}

function PracticeExercises({ userProgress, onProgressUpdate }: PracticeScreenProps) {
  const handleStartPractice = async (categoryId: number) => {
    // Award XP for starting practice
    if (onProgressUpdate) {
      await onProgressUpdate({
        totalXP: 10
      })
    }
    // Here you could navigate to specific practice mode
    alert('Tính năng sẽ được phát triển thêm!')
  }

  return (
    <div className="space-y-6">
      <FlashcardDemo onProgressUpdate={onProgressUpdate} />

      <div className="grid grid-cols-1 gap-4">
        {practiceCategories.map((category) => {
          const Icon = category.icon
          return (
            <Card key={category.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
              <div className="flex">
                <div className={`w-20 h-20 bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="flex-1 p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{category.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                  <span className="text-xs text-gray-500">{category.count}</span>
                </div>
                
                <div className="flex items-center pr-4">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleStartPractice(category.id)}
                  >
                    Bắt đầu
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export function PracticeScreen({ userProgress, onProgressUpdate }: PracticeScreenProps) {
  return (
    <div className="p-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Luyện tập</h1>
        <p className="text-gray-600">Học bảng chữ cái và luyện tập với flashcard, quiz</p>
      </div>

      <Tabs defaultValue="exercises" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="exercises" className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4" />
            Bài tập
          </TabsTrigger>
          <TabsTrigger value="alphabet" className="flex items-center gap-2">
            <Languages className="w-4 h-4" />
            Bảng chữ cái
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="exercises" className="space-y-6">
          <PracticeExercises userProgress={userProgress} onProgressUpdate={onProgressUpdate} />
        </TabsContent>
        
        <TabsContent value="alphabet" className="space-y-6">
          <div className="px-0">
            <AlphabetScreen />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}