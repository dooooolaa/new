import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Download, Volume2, Clock, User } from 'lucide-react'

// Sample audio data - in a real app, this would come from an API
const audioLibrary = {
  quran: [
    {
      id: 1,
      title: 'سورة الفاتحة',
      titleEn: 'Al-Fatiha',
      reciter: 'عبد الباسط عبد الصمد',
      reciterEn: 'Abdul Basit Abdul Samad',
      duration: '2:15',
      url: 'https://server8.mp3quran.net/abd_basit/001.mp3',
      description: 'تلاوة مجودة لسورة الفاتحة',
      category: 'quran'
    },
    {
      id: 2,
      title: 'سورة البقرة',
      titleEn: 'Al-Baqarah',
      reciter: 'مشاري راشد العفاسي',
      reciterEn: 'Mishary Rashid Alafasy',
      duration: '2:45:30',
      url: 'https://server8.mp3quran.net/afs/002.mp3',
      description: 'تلاوة خاشعة لسورة البقرة',
      category: 'quran'
    },
    {
      id: 3,
      title: 'سورة آل عمران',
      titleEn: 'Aal-E-Imran',
      reciter: 'سعد الغامدي',
      reciterEn: 'Saad Al-Ghamdi',
      duration: '1:58:45',
      url: 'https://server8.mp3quran.net/gmd/003.mp3',
      description: 'تلاوة مؤثرة لسورة آل عمران',
      category: 'quran'
    }
  ],
  lectures: [
    {
      id: 4,
      title: 'أسماء الله الحسنى',
      titleEn: 'The Beautiful Names of Allah',
      speaker: 'الشيخ محمد راتب النابلسي',
      speakerEn: 'Sheikh Muhammad Rateb Al-Nabulsi',
      duration: '45:20',
      url: 'https://example.com/lecture1.mp3',
      description: 'شرح مفصل لأسماء الله الحسنى ومعانيها',
      category: 'lectures'
    },
    {
      id: 5,
      title: 'السيرة النبوية',
      titleEn: 'The Prophetic Biography',
      speaker: 'الدكتور طارق السويدان',
      speakerEn: 'Dr. Tariq Al-Suwaidan',
      duration: '1:15:30',
      url: 'https://example.com/lecture2.mp3',
      description: 'دروس في السيرة النبوية الشريفة',
      category: 'lectures'
    },
    {
      id: 6,
      title: 'فقه العبادات',
      titleEn: 'Jurisprudence of Worship',
      speaker: 'الشيخ صالح المغامسي',
      speakerEn: 'Sheikh Saleh Al-Maghamsi',
      duration: '52:10',
      url: 'https://example.com/lecture3.mp3',
      description: 'أحكام الصلاة والزكاة والصيام والحج',
      category: 'lectures'
    }
  ],
  nasheeds: [
    {
      id: 7,
      title: 'طلع البدر علينا',
      titleEn: 'Tala\'a Al-Badru Alayna',
      artist: 'فرقة الإنشاد الإسلامي',
      artistEn: 'Islamic Nasheed Group',
      duration: '4:25',
      url: 'https://example.com/nasheed1.mp3',
      description: 'النشيد الذي استقبل به أهل المدينة النبي صلى الله عليه وسلم',
      category: 'nasheeds'
    },
    {
      id: 8,
      title: 'يا رسول الله',
      titleEn: 'Ya Rasool Allah',
      artist: 'ماهر زين',
      artistEn: 'Maher Zain',
      duration: '5:15',
      url: 'https://example.com/nasheed2.mp3',
      description: 'نشيد في مدح النبي صلى الله عليه وسلم',
      category: 'nasheeds'
    }
  ]
}

const categories = {
  quran: { name: 'تلاوات القرآن', icon: '📖', description: 'تلاوات مختارة من القرآن الكريم' },
  lectures: { name: 'المحاضرات', icon: '🎤', description: 'محاضرات ودروس إسلامية' },
  nasheeds: { name: 'الأناشيد', icon: '🎵', description: 'أناشيد إسلامية بدون موسيقى' }
}

export default function AudioLibrary() {
  const [selectedCategory, setSelectedCategory] = useState('quran')
  const [currentAudio, setCurrentAudio] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const audioRef = useRef(null)

  const getCurrentAudios = () => {
    return audioLibrary[selectedCategory] || []
  }

  const filteredAudios = getCurrentAudios().filter(audio =>
    audio.title.includes(searchTerm) || 
    audio.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    audio.reciter?.includes(searchTerm) ||
    audio.speaker?.includes(searchTerm) ||
    audio.artist?.includes(searchTerm)
  )

  const playAudio = (audio) => {
    if (currentAudio?.id === audio.id) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    } else {
      setCurrentAudio(audio)
      setIsPlaying(true)
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    if (currentAudio && audioRef.current) {
      audioRef.current.src = currentAudio.url
      if (isPlaying) {
        audioRef.current.play().catch(console.error)
      }
    }
  }, [currentAudio])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            المكتبة الصوتية
          </h1>
          <p className="text-xl text-gray-300">
            مجموعة مختارة من التلاوات والمحاضرات والأناشيد الإسلامية
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
              placeholder="ابحث في المكتبة الصوتية..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Audio Player */}
        {currentAudio && (
          <div className="mb-8 p-6 bg-gray-800/50 rounded-lg border border-gray-600">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-yellow-400">{currentAudio.title}</h3>
                <p className="text-gray-400">
                  {currentAudio.reciter || currentAudio.speaker || currentAudio.artist}
                </p>
              </div>
              <button
                onClick={() => playAudio(currentAudio)}
                className="p-3 bg-yellow-400 text-black rounded-full hover:bg-yellow-500 transition-colors"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">{formatTime(currentTime)}</span>
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-400">{formatTime(duration)}</span>
            </div>
          </div>
        )}

        {/* Audio List */}
        <div className="space-y-4">
          {filteredAudios.map((audio) => (
            <div key={audio.id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-600 hover:border-yellow-400/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-yellow-400 mb-1">{audio.title}</h3>
                  <p className="text-gray-400 text-sm mb-1">{audio.titleEn}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <User size={16} className="mr-1" />
                      {audio.reciter || audio.speaker || audio.artist}
                    </span>
                    <span className="flex items-center">
                      <Clock size={16} className="mr-1" />
                      {audio.duration}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mt-2">{audio.description}</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => playAudio(audio)}
                    className={`p-3 rounded-full transition-colors ${
                      currentAudio?.id === audio.id && isPlaying
                        ? 'bg-yellow-400 text-black'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {currentAudio?.id === audio.id && isPlaying ? 
                      <Pause size={20} /> : <Play size={20} />
                    }
                  </button>
                  
                  <button
                    onClick={() => window.open(audio.url, '_blank')}
                    className="p-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors"
                    title="تحميل"
                  >
                    <Download size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAudios.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">لا توجد نتائج للبحث</p>
          </div>
        )}

        {/* Hidden Audio Element */}
        <audio ref={audioRef} />
      </div>
    </div>
  )
}

