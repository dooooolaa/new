import { useState, useEffect } from 'react'
import { Search, Filter, BookOpen, Headphones, Video, User, Clock, Star } from 'lucide-react'

// Sample search data - in a real app, this would come from APIs
const searchData = {
  quran: [
    {
      id: 1,
      type: 'quran',
      title: 'سورة الفاتحة',
      titleEn: 'Al-Fatiha',
      content: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      surah: 1,
      ayah: 1,
      description: 'أم الكتاب والسبع المثاني'
    },
    {
      id: 2,
      type: 'quran',
      title: 'آية الكرسي',
      titleEn: 'Ayat al-Kursi',
      content: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
      surah: 2,
      ayah: 255,
      description: 'أعظم آية في القرآن الكريم'
    }
  ],
  hadith: [
    {
      id: 3,
      type: 'hadith',
      title: 'حديث الأعمال بالنيات',
      content: 'إنما الأعمال بالنيات وإنما لكل امرئ ما نوى',
      narrator: 'عمر بن الخطاب',
      source: 'صحيح البخاري',
      grade: 'صحيح',
      description: 'أهمية النية في الأعمال'
    },
    {
      id: 4,
      type: 'hadith',
      title: 'حديث الإسلام على خمس',
      content: 'بني الإسلام على خمس: شهادة أن لا إله إلا الله وأن محمداً رسول الله',
      narrator: 'ابن عمر',
      source: 'صحيح البخاري',
      grade: 'صحيح',
      description: 'أركان الإسلام الخمسة'
    }
  ],
  scholars: [
    {
      id: 5,
      type: 'scholar',
      name: 'الإمام أبو حنيفة',
      nameEn: 'Imam Abu Hanifa',
      period: '80-150 هـ',
      specialty: 'الفقه والأصول',
      description: 'إمام المذهب الحنفي وأحد الأئمة الأربعة',
      achievements: ['تأسيس المذهب الحنفي', 'تطوير علم الأصول']
    },
    {
      id: 6,
      type: 'scholar',
      name: 'الإمام النووي',
      nameEn: 'Imam An-Nawawi',
      period: '631-676 هـ',
      specialty: 'الحديث والفقه',
      description: 'عالم محدث وفقيه شافعي',
      achievements: ['الأربعون النووية', 'رياض الصالحين']
    }
  ],
  audio: [
    {
      id: 7,
      type: 'audio',
      title: 'تلاوة سورة البقرة',
      reciter: 'عبد الباسط عبد الصمد',
      duration: '2:45:30',
      category: 'تلاوات القرآن',
      description: 'تلاوة مجودة لسورة البقرة'
    },
    {
      id: 8,
      type: 'audio',
      title: 'محاضرة أسماء الله الحسنى',
      speaker: 'الشيخ محمد راتب النابلسي',
      duration: '45:20',
      category: 'محاضرات',
      description: 'شرح مفصل لأسماء الله الحسنى'
    }
  ],
  video: [
    {
      id: 9,
      type: 'video',
      title: 'قصص الأنبياء - سيدنا آدم',
      speaker: 'الشيخ نبيل العوضي',
      duration: '45:30',
      views: '2.5M',
      category: 'تعليمية',
      description: 'قصة سيدنا آدم عليه السلام'
    },
    {
      id: 10,
      type: 'video',
      title: 'تعليم الوضوء للأطفال',
      speaker: 'قناة براعم الإيمان',
      duration: '8:15',
      views: '850K',
      category: 'الأطفال',
      description: 'تعليم الأطفال كيفية الوضوء'
    }
  ]
}

const searchCategories = {
  all: { name: 'الكل', icon: Search },
  quran: { name: 'القرآن الكريم', icon: BookOpen },
  hadith: { name: 'الحديث الشريف', icon: BookOpen },
  scholars: { name: 'العلماء', icon: User },
  audio: { name: 'المكتبة الصوتية', icon: Headphones },
  video: { name: 'المكتبة المرئية', icon: Video }
}

export default function SmartSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [recentSearches, setRecentSearches] = useState([
    'سورة الفاتحة',
    'أحاديث الأربعين النووية',
    'الإمام الشافعي',
    'تلاوة القرآن'
  ])

  // Simulate search with debouncing
  useEffect(() => {
    if (searchTerm.length > 2) {
      setIsSearching(true)
      const timer = setTimeout(() => {
        performSearch()
        setIsSearching(false)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setSearchResults([])
    }
  }, [searchTerm, selectedCategory])

  const performSearch = () => {
    let results = []
    
    if (selectedCategory === 'all') {
      // Search in all categories
      Object.values(searchData).forEach(categoryData => {
        results = results.concat(categoryData)
      })
    } else {
      // Search in specific category
      results = searchData[selectedCategory] || []
    }

    // Filter results based on search term
    const filteredResults = results.filter(item => {
      const searchLower = searchTerm.toLowerCase()
      return (
        item.title?.toLowerCase().includes(searchLower) ||
        item.titleEn?.toLowerCase().includes(searchLower) ||
        item.content?.toLowerCase().includes(searchLower) ||
        item.name?.toLowerCase().includes(searchLower) ||
        item.nameEn?.toLowerCase().includes(searchLower) ||
        item.reciter?.toLowerCase().includes(searchLower) ||
        item.speaker?.toLowerCase().includes(searchLower) ||
        item.narrator?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower)
      )
    })

    setSearchResults(filteredResults)
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    if (term && !recentSearches.includes(term)) {
      setRecentSearches(prev => [term, ...prev.slice(0, 4)])
    }
  }

  const getResultIcon = (type) => {
    switch (type) {
      case 'quran': return <BookOpen className="w-5 h-5 text-green-400" />
      case 'hadith': return <BookOpen className="w-5 h-5 text-blue-400" />
      case 'scholar': return <User className="w-5 h-5 text-purple-400" />
      case 'audio': return <Headphones className="w-5 h-5 text-yellow-400" />
      case 'video': return <Video className="w-5 h-5 text-red-400" />
      default: return <Search className="w-5 h-5 text-gray-400" />
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'quran': return 'القرآن الكريم'
      case 'hadith': return 'الحديث الشريف'
      case 'scholar': return 'عالم'
      case 'audio': return 'صوتي'
      case 'video': return 'مرئي'
      default: return ''
    }
  }

  const renderSearchResult = (result) => {
    switch (result.type) {
      case 'quran':
        return (
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600 hover:border-green-400/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getResultIcon(result.type)}
                <div>
                  <h3 className="text-lg font-bold text-green-400">{result.title}</h3>
                  <p className="text-sm text-gray-400">{result.titleEn}</p>
                </div>
              </div>
              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                {getTypeLabel(result.type)}
              </span>
            </div>
            <p className="text-gray-300 mb-2 arabic-text text-lg">{result.content}</p>
            <p className="text-sm text-gray-400">{result.description}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-500">
                سورة {result.surah} - آية {result.ayah}
              </span>
              <button className="text-green-400 hover:text-green-300 text-sm">
                اقرأ المزيد
              </button>
            </div>
          </div>
        )

      case 'hadith':
        return (
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600 hover:border-blue-400/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getResultIcon(result.type)}
                <div>
                  <h3 className="text-lg font-bold text-blue-400">{result.title}</h3>
                  <p className="text-sm text-gray-400">رواه {result.narrator}</p>
                </div>
              </div>
              <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                {result.grade}
              </span>
            </div>
            <p className="text-gray-300 mb-2 arabic-text">{result.content}</p>
            <p className="text-sm text-gray-400">{result.description}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-500">{result.source}</span>
              <button className="text-blue-400 hover:text-blue-300 text-sm">
                اقرأ المزيد
              </button>
            </div>
          </div>
        )

      case 'scholar':
        return (
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600 hover:border-purple-400/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getResultIcon(result.type)}
                <div>
                  <h3 className="text-lg font-bold text-purple-400">{result.name}</h3>
                  <p className="text-sm text-gray-400">{result.nameEn}</p>
                </div>
              </div>
              <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">
                {result.period}
              </span>
            </div>
            <p className="text-gray-300 mb-2">{result.description}</p>
            <p className="text-sm text-gray-400 mb-3">التخصص: {result.specialty}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-gray-500">
                  {result.achievements.length} إنجاز
                </span>
              </div>
              <button className="text-purple-400 hover:text-purple-300 text-sm">
                عرض السيرة
              </button>
            </div>
          </div>
        )

      case 'audio':
        return (
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600 hover:border-yellow-400/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getResultIcon(result.type)}
                <div>
                  <h3 className="text-lg font-bold text-yellow-400">{result.title}</h3>
                  <p className="text-sm text-gray-400">
                    {result.reciter || result.speaker}
                  </p>
                </div>
              </div>
              <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs">
                {result.category}
              </span>
            </div>
            <p className="text-gray-300 mb-3">{result.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">{result.duration}</span>
              </div>
              <button className="text-yellow-400 hover:text-yellow-300 text-sm">
                استمع الآن
              </button>
            </div>
          </div>
        )

      case 'video':
        return (
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600 hover:border-red-400/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getResultIcon(result.type)}
                <div>
                  <h3 className="text-lg font-bold text-red-400">{result.title}</h3>
                  <p className="text-sm text-gray-400">{result.speaker}</p>
                </div>
              </div>
              <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs">
                {result.category}
              </span>
            </div>
            <p className="text-gray-300 mb-3">{result.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {result.duration}
                </span>
                <span>{result.views} مشاهدة</span>
              </div>
              <button className="text-red-400 hover:text-red-300 text-sm">
                شاهد الآن
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            البحث الذكي
          </h1>
          <p className="text-xl text-gray-300">
            ابحث في القرآن الكريم والأحاديث والعلماء والمكتبة الصوتية والمرئية
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              placeholder="ابحث في جميع المحتويات الإسلامية..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-6 py-4 pr-14 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none text-lg"
            />
            {isSearching && (
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400"></div>
              </div>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {Object.entries(searchCategories).map(([key, category]) => {
              const IconComponent = category.icon
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                    selectedCategory === key
                      ? 'border-yellow-400 bg-yellow-400/20 text-yellow-400'
                      : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-yellow-400/50'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Recent Searches */}
        {searchTerm.length === 0 && (
          <div className="max-w-4xl mx-auto mb-8">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">عمليات البحث الأخيرة</h2>
            <div className="flex flex-wrap gap-3">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => setSearchTerm(search)}
                  className="px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-gray-300 hover:border-yellow-400/50 hover:text-yellow-400 transition-all duration-200"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-yellow-400">
                نتائج البحث ({searchResults.length})
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Filter className="w-4 h-4" />
                <span>مرتبة حسب الصلة</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {searchResults.map((result) => (
                <div key={result.id}>
                  {renderSearchResult(result)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {searchTerm.length > 2 && searchResults.length === 0 && !isSearching && (
          <div className="max-w-4xl mx-auto text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">لا توجد نتائج</h3>
            <p className="text-gray-500">
              جرب استخدام كلمات مختلفة أو تحقق من الإملاء
            </p>
          </div>
        )}

        {/* Search Tips */}
        {searchTerm.length === 0 && (
          <div className="max-w-4xl mx-auto mt-12">
            <h2 className="text-xl font-bold text-yellow-400 mb-6 text-center">نصائح للبحث</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600">
                <BookOpen className="w-8 h-8 text-green-400 mb-3" />
                <h3 className="text-lg font-bold text-green-400 mb-2">البحث في القرآن</h3>
                <p className="text-gray-400 text-sm">
                  ابحث بأسماء السور أو كلمات من الآيات أو أرقام السور والآيات
                </p>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600">
                <BookOpen className="w-8 h-8 text-blue-400 mb-3" />
                <h3 className="text-lg font-bold text-blue-400 mb-2">البحث في الأحاديث</h3>
                <p className="text-gray-400 text-sm">
                  ابحث بنص الحديث أو اسم الراوي أو المصدر أو الموضوع
                </p>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600">
                <User className="w-8 h-8 text-purple-400 mb-3" />
                <h3 className="text-lg font-bold text-purple-400 mb-2">البحث في العلماء</h3>
                <p className="text-gray-400 text-sm">
                  ابحث بأسماء العلماء أو تخصصاتهم أو فتراتهم الزمنية
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

