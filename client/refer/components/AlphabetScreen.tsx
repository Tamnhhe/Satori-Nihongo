import { useState } from 'react'
import { Card } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

const hiraganaData = [
  { char: 'あ', romaji: 'a' }, { char: 'い', romaji: 'i' }, { char: 'う', romaji: 'u' }, { char: 'え', romaji: 'e' }, { char: 'お', romaji: 'o' },
  { char: 'か', romaji: 'ka' }, { char: 'き', romaji: 'ki' }, { char: 'く', romaji: 'ku' }, { char: 'け', romaji: 'ke' }, { char: 'こ', romaji: 'ko' },
  { char: 'さ', romaji: 'sa' }, { char: 'し', romaji: 'shi' }, { char: 'す', romaji: 'su' }, { char: 'せ', romaji: 'se' }, { char: 'そ', romaji: 'so' },
  { char: 'た', romaji: 'ta' }, { char: 'ち', romaji: 'chi' }, { char: 'つ', romaji: 'tsu' }, { char: 'て', romaji: 'te' }, { char: 'と', romaji: 'to' }
]

const katakanaData = [
  { char: 'ア', romaji: 'a' }, { char: 'イ', romaji: 'i' }, { char: 'ウ', romaji: 'u' }, { char: 'エ', romaji: 'e' }, { char: 'オ', romaji: 'o' },
  { char: 'カ', romaji: 'ka' }, { char: 'キ', romaji: 'ki' }, { char: 'ク', romaji: 'ku' }, { char: 'ケ', romaji: 'ke' }, { char: 'コ', romaji: 'ko' },
  { char: 'サ', romaji: 'sa' }, { char: 'シ', romaji: 'shi' }, { char: 'ス', romaji: 'su' }, { char: 'セ', romaji: 'se' }, { char: 'ソ', romaji: 'so' },
  { char: 'タ', romaji: 'ta' }, { char: 'チ', romaji: 'chi' }, { char: 'ツ', romaji: 'tsu' }, { char: 'テ', romaji: 'te' }, { char: 'ト', romaji: 'to' }
]

const kanjiData = [
  { char: '人', romaji: 'hito', meaning: 'người' }, { char: '日', romaji: 'hi', meaning: 'ngày' }, 
  { char: '本', romaji: 'hon', meaning: 'sách' }, { char: '水', romaji: 'mizu', meaning: 'nước' },
  { char: '火', romaji: 'hi', meaning: 'lửa' }, { char: '木', romaji: 'ki', meaning: 'cây' },
  { char: '金', romaji: 'kin', meaning: 'vàng' }, { char: '土', romaji: 'tsuchi', meaning: 'đất' },
  { char: '大', romaji: 'dai', meaning: 'lớn' }, { char: '小', romaji: 'shou', meaning: 'nhỏ' },
  { char: '中', romaji: 'naka', meaning: 'giữa' }, { char: '上', romaji: 'ue', meaning: 'trên' }
]

function CharacterGrid({ data, type }: { data: any[], type: string }) {
  return (
    <div className="grid grid-cols-5 gap-3 p-4">
      {data.map((item, index) => (
        <Card key={index} className="aspect-square flex flex-col items-center justify-center p-2 hover:bg-gray-50 cursor-pointer transition-colors">
          <div className="text-2xl font-bold text-gray-800 mb-1">{item.char}</div>
          <div className="text-xs text-gray-500 text-center">{item.romaji}</div>
          {type === 'kanji' && <div className="text-xs text-blue-600 text-center mt-1">{item.meaning}</div>}
        </Card>
      ))}
    </div>
  )
}

export function AlphabetScreen() {
  return (
    <div className="p-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Bảng chữ cái</h1>
        <p className="text-gray-600">Học và ôn tập các bảng chữ cái tiếng Nhật</p>
      </div>

      <Tabs defaultValue="hiragana" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hiragana">Hiragana</TabsTrigger>
          <TabsTrigger value="katakana">Katakana</TabsTrigger>
          <TabsTrigger value="kanji">Kanji</TabsTrigger>
        </TabsList>
        
        <TabsContent value="hiragana" className="mt-4">
          <Card>
            <div className="p-4 border-b">
              <h3 className="font-semibold">Hiragana (ひらがな)</h3>
              <p className="text-sm text-gray-600">Bảng chữ cái cơ bản của tiếng Nhật</p>
            </div>
            <CharacterGrid data={hiraganaData} type="hiragana" />
          </Card>
        </TabsContent>
        
        <TabsContent value="katakana" className="mt-4">
          <Card>
            <div className="p-4 border-b">
              <h3 className="font-semibold">Katakana (カタカナ)</h3>
              <p className="text-sm text-gray-600">Dùng cho từ ngoại lai và âm thanh</p>
            </div>
            <CharacterGrid data={katakanaData} type="katakana" />
          </Card>
        </TabsContent>
        
        <TabsContent value="kanji" className="mt-4">
          <Card>
            <div className="p-4 border-b">
              <h3 className="font-semibold">Kanji (漢字)</h3>
              <p className="text-sm text-gray-600">Chữ Hán sử dụng trong tiếng Nhật</p>
            </div>
            <CharacterGrid data={kanjiData} type="kanji" />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}