import { useState } from 'react'
import { Play, Download, Clock, User, Eye, Heart } from 'lucide-react'

// Sample video data - in a real app, this would come from an API
const videoLibrary = {
  educational: [
    {
      id: 1,
      title: 'قصص الأنبياء - سيدنا آدم عليه السلام',
      titleEn: 'Stories of the Prophets - Prophet Adam',
      speaker: 'الشيخ نبيل العوضي',
      speakerEn: 'Sheikh Nabil Al-Awadi',
      duration: '45:30',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'قصة سيدنا آدم عليه السلام من البداية إلى النهاية',
      views: '2.5M',
      category: 'educational'
    },
    {
      id: 2,
      title: 'أركان الإسلام الخمسة',
      titleEn: 'The Five Pillars of Islam',
      speaker: 'الدكتور عمر عبد الكافي',
      speakerEn: 'Dr. Omar Abdul Kafi',
      duration: '1:15:20',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'شرح مفصل لأركان الإسلام الخمسة',
      views: '1.8M',
      category: 'educational'
    },
    {
      id: 3,
      title: 'السيرة النبوية - الهجرة إلى المدينة',
      titleEn: 'Prophetic Biography - Migration to Medina',
      speaker: 'الدكتور راغب السرجاني',
      speakerEn: 'Dr. Ragheb Al-Sirjani',
      duration: '52:45',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'تفاصيل هجرة النبي صلى الله عليه وسلم إلى المدينة',
      views: '3.2M',
      category: 'educational'
    }
  ],
  children: [
    {
      id: 4,
      title: 'تعليم الوضوء للأطفال',
      titleEn: 'Teaching Wudu to Children',
      speaker: 'قناة براعم الإيمان',
      speakerEn: 'Braem Al-Iman Channel',
      duration: '8:15',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'تعليم الأطفال كيفية الوضوء بطريقة مبسطة',
      views: '850K',
      category: 'children'
    },
    {
      id: 5,
      title: 'أسماء الله الحسنى للأطفال',
      titleEn: 'Beautiful Names of Allah for Children',
      speaker: 'قناة طيور الجنة',
      speakerEn: 'Toyor Al-Janah Channel',
      duration: '12:30',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'تعليم الأطفال أسماء الله الحسنى بالأناشيد',
      views: '1.2M',
      category: 'children'
    },
    {
      id: 6,
      title: 'قصة سيدنا يوسف للأطفال',
      titleEn: 'Story of Prophet Yusuf for Children',
      speaker: 'استوديو الأطفال الإسلامي',
      speakerEn: 'Islamic Children Studio',
      duration: '25:40',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'قصة سيدنا يوسف مصورة للأطفال',
      views: '2.1M',
      category: 'children'
    }
  ],
  lectures: [
    {
      id: 7,
      title: 'خطبة الجمعة - التوبة النصوح',
      titleEn: 'Friday Sermon - Sincere Repentance',
      speaker: 'الشيخ محمد حسان',
      speakerEn: 'Sheikh Muhammad Hassan',
      duration: '35:20',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'خطبة مؤثرة عن التوبة النصوح وشروطها',
      views: '950K',
      category: 'lectures'
    },
    {
      id: 8,
      title: 'برنامج خواطر - الحلقة الأولى',
      titleEn: 'Khawater Program - Episode 1',
      speaker: 'أحمد الشقيري',
      speakerEn: 'Ahmed Al-Shugairi',
      duration: '28:45',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'برنامج خواطر الشهير للداعية أحمد الشقيري',
      views: '5.8M',
      category: 'lectures'
    }
  ]
}

const categories = {
  educational: { name: 'تعليمية', icon: '🎓', description: 'فيديوهات تعليمية في العلوم الشرعية' },
  children: { name: 'الأطفال', icon: '👶', description: 'محتوى إسلامي مناسب للأطفال' },
  lectures: { name: 'محاضرات', icon: '🎤', description: 'محاضرات وخطب إسلامية' }
}

export default function VideoLibrary() {
  const [selectedCategory, setSelectedCategory] = useState('educational')
  const [searchTerm, setSearchTerm] = useState('')
  const [favorites, setFavorites] = useState([])

  const getCurrentVideos = () => {
    return videoLibrary[selectedCategory] || []
  }

  const filteredVideos = getCurrentVideos().filter(video =>
    video.title.includes(searchTerm) || 
    video.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.speaker.includes(searchTerm) ||
    video.description.includes(searchTerm)
  )

  const toggleFavorite = (videoId) => {
    setFavorites(prev => 
      prev.includes(videoId) 
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    )
  }

  const formatViews = (views) => {
    if (views.includes('M')) return views.replace('M', ' مليون')
    if (views.includes('K')) return views.replace('K', ' ألف')
    return views
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            المكتبة المرئية
          </h1>
          <p className="text-xl text-gray-300">
            مجموعة مختارة من الفيديوهات التعليمية والدعوية الإسلامية
          </p>
        </div>

        {/* Category Selection */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                  selectedCategory === key
                    ? 'border-yellow-400 bg-yellow-400/20 shadow-lg shadow-yellow-400/25'
                    : 'border-gray-600 bg-gray-800/50 hover:border-yellow-400/50'
                }`}
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-400">{category.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="ابحث في المكتبة المرئية..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div key={video.id} className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-600 hover:border-yellow-400/50 transition-all duration-300">
              {/* Video Thumbnail */}
              <div className="relative">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => window.open(video.url, '_blank')}
                    className="p-4 bg-yellow-400 text-black rounded-full hover:bg-yellow-500 transition-colors"
                  >
                    <Play size={32} />
                  </button>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  {video.duration}
                </div>
              </div>

              {/* Video Info */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-yellow-400 mb-2 line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-gray-400 text-sm mb-2">{video.titleEn}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <User size={16} className="mr-1" />
                    <span className="truncate">{video.speaker}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Eye size={16} className="mr-1" />
                    <span>{formatViews(video.views)}</span>
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {video.description}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => window.open(video.url, '_blank')}
                    className="flex items-center space-x-2 bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors"
                  >
                    <Play size={16} />
                    <span>مشاهدة</span>
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleFavorite(video.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        favorites.includes(video.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <Heart size={16} />
                    </button>
                    
                    <button
                      onClick={() => window.open(video.url, '_blank')}
                      className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                      title="تحميل"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">لا توجد نتائج للبحث</p>
          </div>
        )}

        {/* Featured Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">المحتوى المميز</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-lg p-6 border border-yellow-400/30">
              <h3 className="text-xl font-bold text-yellow-400 mb-3">سلسلة قصص الأنبياء</h3>
              <p className="text-gray-300 mb-4">
                سلسلة شاملة تحكي قصص جميع الأنبياء والرسل عليهم السلام بأسلوب شيق ومفيد
              </p>
              <button className="bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-500 transition-colors">
                مشاهدة السلسلة
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-lg p-6 border border-purple-400/30">
              <h3 className="text-xl font-bold text-purple-400 mb-3">برامج الأطفال</h3>
              <p className="text-gray-300 mb-4">
                مجموعة متنوعة من البرامج التعليمية المناسبة للأطفال لتعليم القيم الإسلامية
              </p>
              <button className="bg-purple-400 text-black px-6 py-2 rounded-lg hover:bg-purple-500 transition-colors">
                استكشاف البرامج
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

