import { BookOpen, Calculator, Code, Palette, Globe, Music } from 'lucide-react'

const categories = [
  { name: 'Ngôn ngữ', icon: Globe, color: 'bg-blue-100 text-blue-600' },
  { name: 'Toán học', icon: Calculator, color: 'bg-green-100 text-green-600' },
  { name: 'Lập trình', icon: Code, color: 'bg-purple-100 text-purple-600' },
  { name: 'Nghệ thuật', icon: Palette, color: 'bg-pink-100 text-pink-600' },
  { name: 'Văn học', icon: BookOpen, color: 'bg-yellow-100 text-yellow-600' },
  { name: 'Âm nhạc', icon: Music, color: 'bg-indigo-100 text-indigo-600' }
]

export function Categories() {
  return (
    <div className="px-6 py-6">
      <h2 className="text-xl font-semibold mb-4">Danh mục</h2>
      
      <div className="grid grid-cols-3 gap-4">
        {categories.map((category, index) => {
          const Icon = category.icon
          return (
            <div
              key={index}
              className="flex flex-col items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className={`p-3 rounded-full ${category.color} mb-2`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-center">{category.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}