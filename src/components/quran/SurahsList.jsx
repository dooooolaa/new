import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Book, Play, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'

// بيانات السور الـ114
const surahs = [
  { number: 1, name: 'الفاتحة', englishName: 'Al-Fatiha', verses: 7, type: 'مكية', juz: 1 },
  { number: 2, name: 'البقرة', englishName: 'Al-Baqarah', verses: 286, type: 'مدنية', juz: 1 },
  { number: 3, name: 'آل عمران', englishName: 'Aal-E-Imran', verses: 200, type: 'مدنية', juz: 3 },
  { number: 4, name: 'النساء', englishName: 'An-Nisa', verses: 176, type: 'مدنية', juz: 4 },
  { number: 5, name: 'المائدة', englishName: 'Al-Maidah', verses: 120, type: 'مدنية', juz: 6 },
  { number: 6, name: 'الأنعام', englishName: 'Al-Anam', verses: 165, type: 'مكية', juz: 7 },
  { number: 7, name: 'الأعراف', englishName: 'Al-Araf', verses: 206, type: 'مكية', juz: 8 },
  { number: 8, name: 'الأنفال', englishName: 'Al-Anfal', verses: 75, type: 'مدنية', juz: 9 },
  { number: 9, name: 'التوبة', englishName: 'At-Tawbah', verses: 129, type: 'مدنية', juz: 10 },
  { number: 10, name: 'يونس', englishName: 'Yunus', verses: 109, type: 'مكية', juz: 11 },
  { number: 11, name: 'هود', englishName: 'Hud', verses: 123, type: 'مكية', juz: 11 },
  { number: 12, name: 'يوسف', englishName: 'Yusuf', verses: 111, type: 'مكية', juz: 12 },
  { number: 13, name: 'الرعد', englishName: 'Ar-Rad', verses: 43, type: 'مدنية', juz: 13 },
  { number: 14, name: 'إبراهيم', englishName: 'Ibrahim', verses: 52, type: 'مكية', juz: 13 },
  { number: 15, name: 'الحجر', englishName: 'Al-Hijr', verses: 99, type: 'مكية', juz: 14 },
  { number: 16, name: 'النحل', englishName: 'An-Nahl', verses: 128, type: 'مكية', juz: 14 },
  { number: 17, name: 'الإسراء', englishName: 'Al-Isra', verses: 111, type: 'مكية', juz: 15 },
  { number: 18, name: 'الكهف', englishName: 'Al-Kahf', verses: 110, type: 'مكية', juz: 15 },
  { number: 19, name: 'مريم', englishName: 'Maryam', verses: 98, type: 'مكية', juz: 16 },
  { number: 20, name: 'طه', englishName: 'Taha', verses: 135, type: 'مكية', juz: 16 },
  { number: 21, name: 'الأنبياء', englishName: 'Al-Anbiya', verses: 112, type: 'مكية', juz: 17 },
  { number: 22, name: 'الحج', englishName: 'Al-Hajj', verses: 78, type: 'مدنية', juz: 17 },
  { number: 23, name: 'المؤمنون', englishName: 'Al-Muminun', verses: 118, type: 'مكية', juz: 18 },
  { number: 24, name: 'النور', englishName: 'An-Nur', verses: 64, type: 'مدنية', juz: 18 },
  { number: 25, name: 'الفرقان', englishName: 'Al-Furqan', verses: 77, type: 'مكية', juz: 18 },
  { number: 26, name: 'الشعراء', englishName: 'Ash-Shuara', verses: 227, type: 'مكية', juz: 19 },
  { number: 27, name: 'النمل', englishName: 'An-Naml', verses: 93, type: 'مكية', juz: 19 },
  { number: 28, name: 'القصص', englishName: 'Al-Qasas', verses: 88, type: 'مكية', juz: 20 },
  { number: 29, name: 'العنكبوت', englishName: 'Al-Ankabut', verses: 69, type: 'مكية', juz: 20 },
  { number: 30, name: 'الروم', englishName: 'Ar-Rum', verses: 60, type: 'مكية', juz: 21 },
  { number: 31, name: 'لقمان', englishName: 'Luqman', verses: 34, type: 'مكية', juz: 21 },
  { number: 32, name: 'السجدة', englishName: 'As-Sajdah', verses: 30, type: 'مكية', juz: 21 },
  { number: 33, name: 'الأحزاب', englishName: 'Al-Ahzab', verses: 73, type: 'مدنية', juz: 21 },
  { number: 34, name: 'سبأ', englishName: 'Saba', verses: 54, type: 'مكية', juz: 22 },
  { number: 35, name: 'فاطر', englishName: 'Fatir', verses: 45, type: 'مكية', juz: 22 },
  { number: 36, name: 'يس', englishName: 'Ya-Sin', verses: 83, type: 'مكية', juz: 22 },
  { number: 37, name: 'الصافات', englishName: 'As-Saffat', verses: 182, type: 'مكية', juz: 23 },
  { number: 38, name: 'ص', englishName: 'Sad', verses: 88, type: 'مكية', juz: 23 },
  { number: 39, name: 'الزمر', englishName: 'Az-Zumar', verses: 75, type: 'مكية', juz: 23 },
  { number: 40, name: 'غافر', englishName: 'Ghafir', verses: 85, type: 'مكية', juz: 24 },
  { number: 41, name: 'فصلت', englishName: 'Fussilat', verses: 54, type: 'مكية', juz: 24 },
  { number: 42, name: 'الشورى', englishName: 'Ash-Shura', verses: 53, type: 'مكية', juz: 25 },
  { number: 43, name: 'الزخرف', englishName: 'Az-Zukhruf', verses: 89, type: 'مكية', juz: 25 },
  { number: 44, name: 'الدخان', englishName: 'Ad-Dukhan', verses: 59, type: 'مكية', juz: 25 },
  { number: 45, name: 'الجاثية', englishName: 'Al-Jathiyah', verses: 37, type: 'مكية', juz: 25 },
  { number: 46, name: 'الأحقاف', englishName: 'Al-Ahqaf', verses: 35, type: 'مكية', juz: 26 },
  { number: 47, name: 'محمد', englishName: 'Muhammad', verses: 38, type: 'مدنية', juz: 26 },
  { number: 48, name: 'الفتح', englishName: 'Al-Fath', verses: 29, type: 'مدنية', juz: 26 },
  { number: 49, name: 'الحجرات', englishName: 'Al-Hujurat', verses: 18, type: 'مدنية', juz: 26 },
  { number: 50, name: 'ق', englishName: 'Qaf', verses: 45, type: 'مكية', juz: 26 },
  { number: 51, name: 'الذاريات', englishName: 'Adh-Dhariyat', verses: 60, type: 'مكية', juz: 26 },
  { number: 52, name: 'الطور', englishName: 'At-Tur', verses: 49, type: 'مكية', juz: 27 },
  { number: 53, name: 'النجم', englishName: 'An-Najm', verses: 62, type: 'مكية', juz: 27 },
  { number: 54, name: 'القمر', englishName: 'Al-Qamar', verses: 55, type: 'مكية', juz: 27 },
  { number: 55, name: 'الرحمن', englishName: 'Ar-Rahman', verses: 78, type: 'مدنية', juz: 27 },
  { number: 56, name: 'الواقعة', englishName: 'Al-Waqiah', verses: 96, type: 'مكية', juz: 27 },
  { number: 57, name: 'الحديد', englishName: 'Al-Hadid', verses: 29, type: 'مدنية', juz: 27 },
  { number: 58, name: 'المجادلة', englishName: 'Al-Mujadila', verses: 22, type: 'مدنية', juz: 28 },
  { number: 59, name: 'الحشر', englishName: 'Al-Hashr', verses: 24, type: 'مدنية', juz: 28 },
  { number: 60, name: 'الممتحنة', englishName: 'Al-Mumtahanah', verses: 13, type: 'مدنية', juz: 28 },
  { number: 61, name: 'الصف', englishName: 'As-Saff', verses: 14, type: 'مدنية', juz: 28 },
  { number: 62, name: 'الجمعة', englishName: 'Al-Jumuah', verses: 11, type: 'مدنية', juz: 28 },
  { number: 63, name: 'المنافقون', englishName: 'Al-Munafiqun', verses: 11, type: 'مدنية', juz: 28 },
  { number: 64, name: 'التغابن', englishName: 'At-Taghabun', verses: 18, type: 'مدنية', juz: 28 },
  { number: 65, name: 'الطلاق', englishName: 'At-Talaq', verses: 12, type: 'مدنية', juz: 28 },
  { number: 66, name: 'التحريم', englishName: 'At-Tahrim', verses: 12, type: 'مدنية', juz: 28 },
  { number: 67, name: 'الملك', englishName: 'Al-Mulk', verses: 30, type: 'مكية', juz: 29 },
  { number: 68, name: 'القلم', englishName: 'Al-Qalam', verses: 52, type: 'مكية', juz: 29 },
  { number: 69, name: 'الحاقة', englishName: 'Al-Haqqah', verses: 52, type: 'مكية', juz: 29 },
  { number: 70, name: 'المعارج', englishName: 'Al-Maarij', verses: 44, type: 'مكية', juz: 29 },
  { number: 71, name: 'نوح', englishName: 'Nuh', verses: 28, type: 'مكية', juz: 29 },
  { number: 72, name: 'الجن', englishName: 'Al-Jinn', verses: 28, type: 'مكية', juz: 29 },
  { number: 73, name: 'المزمل', englishName: 'Al-Muzzammil', verses: 20, type: 'مكية', juz: 29 },
  { number: 74, name: 'المدثر', englishName: 'Al-Muddaththir', verses: 56, type: 'مكية', juz: 29 },
  { number: 75, name: 'القيامة', englishName: 'Al-Qiyamah', verses: 40, type: 'مكية', juz: 29 },
  { number: 76, name: 'الإنسان', englishName: 'Al-Insan', verses: 31, type: 'مدنية', juz: 29 },
  { number: 77, name: 'المرسلات', englishName: 'Al-Mursalat', verses: 50, type: 'مكية', juz: 29 },
  { number: 78, name: 'النبأ', englishName: 'An-Naba', verses: 40, type: 'مكية', juz: 30 },
  { number: 79, name: 'النازعات', englishName: 'An-Naziat', verses: 46, type: 'مكية', juz: 30 },
  { number: 80, name: 'عبس', englishName: 'Abasa', verses: 42, type: 'مكية', juz: 30 },
  { number: 81, name: 'التكوير', englishName: 'At-Takwir', verses: 29, type: 'مكية', juz: 30 },
  { number: 82, name: 'الانفطار', englishName: 'Al-Infitar', verses: 19, type: 'مكية', juz: 30 },
  { number: 83, name: 'المطففين', englishName: 'Al-Mutaffifin', verses: 36, type: 'مكية', juz: 30 },
  { number: 84, name: 'الانشقاق', englishName: 'Al-Inshiqaq', verses: 25, type: 'مكية', juz: 30 },
  { number: 85, name: 'البروج', englishName: 'Al-Buruj', verses: 22, type: 'مكية', juz: 30 },
  { number: 86, name: 'الطارق', englishName: 'At-Tariq', verses: 17, type: 'مكية', juz: 30 },
  { number: 87, name: 'الأعلى', englishName: 'Al-Ala', verses: 19, type: 'مكية', juz: 30 },
  { number: 88, name: 'الغاشية', englishName: 'Al-Ghashiyah', verses: 26, type: 'مكية', juz: 30 },
  { number: 89, name: 'الفجر', englishName: 'Al-Fajr', verses: 30, type: 'مكية', juz: 30 },
  { number: 90, name: 'البلد', englishName: 'Al-Balad', verses: 20, type: 'مكية', juz: 30 },
  { number: 91, name: 'الشمس', englishName: 'Ash-Shams', verses: 15, type: 'مكية', juz: 30 },
  { number: 92, name: 'الليل', englishName: 'Al-Layl', verses: 21, type: 'مكية', juz: 30 },
  { number: 93, name: 'الضحى', englishName: 'Ad-Duhaa', verses: 11, type: 'مكية', juz: 30 },
  { number: 94, name: 'الشرح', englishName: 'Ash-Sharh', verses: 8, type: 'مكية', juz: 30 },
  { number: 95, name: 'التين', englishName: 'At-Tin', verses: 8, type: 'مكية', juz: 30 },
  { number: 96, name: 'العلق', englishName: 'Al-Alaq', verses: 19, type: 'مكية', juz: 30 },
  { number: 97, name: 'القدر', englishName: 'Al-Qadr', verses: 5, type: 'مكية', juz: 30 },
  { number: 98, name: 'البينة', englishName: 'Al-Bayyinah', verses: 8, type: 'مدنية', juz: 30 },
  { number: 99, name: 'الزلزلة', englishName: 'Az-Zalzalah', verses: 8, type: 'مدنية', juz: 30 },
  { number: 100, name: 'العاديات', englishName: 'Al-Adiyat', verses: 11, type: 'مكية', juz: 30 },
  { number: 101, name: 'القارعة', englishName: 'Al-Qariah', verses: 11, type: 'مكية', juz: 30 },
  { number: 102, name: 'التكاثر', englishName: 'At-Takathur', verses: 8, type: 'مكية', juz: 30 },
  { number: 103, name: 'العصر', englishName: 'Al-Asr', verses: 3, type: 'مكية', juz: 30 },
  { number: 104, name: 'الهمزة', englishName: 'Al-Humazah', verses: 9, type: 'مكية', juz: 30 },
  { number: 105, name: 'الفيل', englishName: 'Al-Fil', verses: 5, type: 'مكية', juz: 30 },
  { number: 106, name: 'قريش', englishName: 'Quraysh', verses: 4, type: 'مكية', juz: 30 },
  { number: 107, name: 'الماعون', englishName: 'Al-Maun', verses: 7, type: 'مكية', juz: 30 },
  { number: 108, name: 'الكوثر', englishName: 'Al-Kawthar', verses: 3, type: 'مكية', juz: 30 },
  { number: 109, name: 'الكافرون', englishName: 'Al-Kafirun', verses: 6, type: 'مكية', juz: 30 },
  { number: 110, name: 'النصر', englishName: 'An-Nasr', verses: 3, type: 'مدنية', juz: 30 },
  { number: 111, name: 'المسد', englishName: 'Al-Masad', verses: 5, type: 'مكية', juz: 30 },
  { number: 112, name: 'الإخلاص', englishName: 'Al-Ikhlas', verses: 4, type: 'مكية', juz: 30 },
  { number: 113, name: 'الفلق', englishName: 'Al-Falaq', verses: 5, type: 'مكية', juz: 30 },
  { number: 114, name: 'الناس', englishName: 'An-Nas', verses: 6, type: 'مكية', juz: 30 }
]

const SurahsList = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all') // all, makkah, madinah

  const filteredSurahs = surahs.filter(surah => {
    const matchesSearch = surah.name.includes(searchTerm) || 
                         surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         surah.number.toString().includes(searchTerm)
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'makkah' && surah.type === 'مكية') ||
                         (filterType === 'madinah' && surah.type === 'مدنية')
    
    return matchesSearch && matchesFilter
  })

  const handleSurahClick = (surahNumber) => {
    navigate(`/quran/${surahNumber}`)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">القرآن الكريم</h1>
            <p className="text-slate-300">اختر السورة التي تريد قراءتها</p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="ابحث عن السورة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 pr-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterType('all')}
                className="text-sm"
              >
                الكل
              </Button>
              <Button
                variant={filterType === 'makkah' ? 'default' : 'outline'}
                onClick={() => setFilterType('makkah')}
                className="text-sm"
              >
                مكية
              </Button>
              <Button
                variant={filterType === 'madinah' ? 'default' : 'outline'}
                onClick={() => setFilterType('madinah')}
                className="text-sm"
              >
                مدنية
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Surahs Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSurahs.map((surah) => (
            <div
              key={surah.number}
              onClick={() => handleSurahClick(surah.number)}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-lg p-4 cursor-pointer transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {surah.number}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      سورة {surah.name}
                    </h3>
                    <p className="text-sm text-slate-400">{surah.englishName}</p>
                  </div>
                </div>
                <Play className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
              </div>

              <div className="flex items-center justify-between text-sm text-slate-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Book className="w-4 h-4" />
                    {surah.verses} آية
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    surah.type === 'مكية' 
                      ? 'bg-orange-900 text-orange-300' 
                      : 'bg-green-900 text-green-300'
                  }`}>
                    {surah.type}
                  </span>
                </div>
                <span className="text-xs">الجزء {surah.juz}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredSurahs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">لا توجد نتائج للبحث</p>
              <p className="text-sm">جرب البحث بكلمات أخرى</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="bg-slate-800 border-t border-slate-700 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-400">114</div>
              <div className="text-sm text-slate-400">سورة</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">6236</div>
              <div className="text-sm text-slate-400">آية</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-400">30</div>
              <div className="text-sm text-slate-400">جزء</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">60</div>
              <div className="text-sm text-slate-400">حزب</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SurahsList