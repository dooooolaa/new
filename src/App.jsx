import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Moon, Sun, Book, Heart, Calendar, Compass, MessageSquare, Clock, User, LogIn } from 'lucide-react'
import QuranReader from './components/quran/QuranReader.jsx'
// import QuranPage from './components/quran/QuranPage.tsx'
import QiblaAndPrayerTimes from './components/qibla/QiblaAndPrayerTimes.jsx'
import HadithCollection from './components/hadith/HadithCollection.jsx'
import AyahViewer from './AyahViewer.jsx'
import ScholarsEncyclopedia from './components/scholars/ScholarsEncyclopedia.jsx'
import AudioLibrary from './components/media/AudioLibrary.jsx'
import VideoLibrary from './components/media/VideoLibrary.jsx'
import InteractiveTests from './components/tests/InteractiveTests.jsx'
import SmartSearch from './components/search/SmartSearch.jsx'
import UserDashboard from './components/dashboard/UserDashboard.jsx'
import AuthModal from './components/auth/AuthModal.jsx'
import AzkarPage from './components/azkar/AzkarPage.jsx'
import DuasPage from './components/duas/DuasPage.jsx'
import CalendarPage from './components/calendar/CalendarPage.jsx'
import { AuthProvider, useAuth } from './components/auth/AuthContext.jsx'
import './App.css'

function HomePage() {
  const sections = [
    {
      id: 'quran',
      title: 'القرآن الكريم',
      description: 'تصفح القرآن الكريم كاملاً مع تفسير الآيات والاستماع إلى التلاوات بأصوات مختلفة',
      icon: Book,
      color: 'blue',
      link: '/quran'
    },
    {
      id: 'hadith',
      title: 'الحديث الشريف',
      description: 'مجموعة من الأحاديث النبوية الصحيحة مصنفة حسب الأبواب الفقهية',
      icon: MessageSquare,
      color: 'red',
      link: '/hadith'
    },
    {
      id: 'azkar',
      title: 'الأذكار',
      description: 'أذكار الصباح والمساء وأذكار بعد الصلاة وأذكار اليوم وغيرها',
      icon: Heart,
      color: 'green',
      link: '/azkar'
    },
    {
      id: 'duas',
      title: 'الأدعية',
      description: 'مجموعة من الأدعية المأثورة عن النبي صلى الله عليه وسلم',
      icon: Heart,
      color: 'pink',
      link: '/duas'
    },
    {
      id: 'calendar',
      title: 'التقويم الهجري',
      description: 'التقويم الهجري مع أوقات الصلاة والمناسبات الإسلامية',
      icon: Calendar,
      color: 'orange',
      link: '/calendar'
    },
    {
      id: 'qibla',
      title: 'اتجاه القبلة',
      description: 'تحديد اتجاه القبلة وأوقات الصلاة حسب موقعك',
      icon: Compass,
      color: 'teal',
      link: '/qibla'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="title-text text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            الإسلام حياة
          </h1>
          <p className="arabic-text text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            موقع إسلامي شامل يجمع القرآن الكريم والأحاديث النبوية والأذكار والأدعية والمزيد
          </p>
          
          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/quran">
              <Button size="lg" className="arabic-text text-lg px-8 py-3">
                تصفح القرآن الكريم
              </Button>
            </Link>
            <Link to="/azkar">
              <Button variant="outline" size="lg" className="arabic-text text-lg px-8 py-3">
                الأذكار اليومية
              </Button>
            </Link>
          </div>

          {/* Verse */}
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="title-text text-2xl font-bold text-gray-800 mb-4">
              احرص على قراءة القرآن وذكر الله كل يوم
            </h2>
            <p className="quran-text text-xl text-green-600 leading-relaxed">
              قال تعالى: ﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾
            </p>
          </div>
        </div>
      </section>

      {/* Sections Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="title-text text-4xl font-bold text-center text-gray-800 mb-12">
            أقسام الموقع
          </h2>
          
          <div className="section-grid">
            {sections.map((section) => {
              const IconComponent = section.icon
              return (
                <Link key={section.id} to={section.link}>
                  <div className={`islamic-card islamic-card-${section.color} h-full`}>
                    <div className={`islamic-icon islamic-icon-${section.color}`}>
                      <IconComponent size={32} />
                    </div>
                    <h3 className="title-text text-xl font-bold text-gray-800 mb-3 text-center">
                      {section.title}
                    </h3>
                    <p className="arabic-text text-gray-600 text-center leading-relaxed">
                      {section.description}
                    </p>
                    <div className="mt-6 text-center">
                      <Button variant="outline" className="arabic-text">
                        تصفح القسم ←
                      </Button>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

function Navigation({ isDark, toggleTheme }) {
  const { user, logout } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const location = useLocation()

  return (
    <>
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="title-text text-2xl font-bold text-green-600">
              الإسلام حياة
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/quran" 
                className={`arabic-text transition-colors ${
                  location.pathname === '/quran' 
                    ? 'text-green-600 font-semibold' 
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                القرآن الكريم
              </Link>
              <Link 
                to="/hadith" 
                className={`arabic-text transition-colors ${
                  location.pathname === '/hadith' 
                    ? 'text-green-600 font-semibold' 
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                الحديث الشريف
              </Link>
              <Link 
                to="/azkar" 
                className={`arabic-text transition-colors ${
                  location.pathname === '/azkar' 
                    ? 'text-green-600 font-semibold' 
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                الأذكار
              </Link>
              <Link 
                to="/scholars" 
                className={`arabic-text transition-colors ${
                  location.pathname === '/scholars' 
                    ? 'text-green-600 font-semibold' 
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                موسوعة العلماء
              </Link>
              <Link 
                to="/audio" 
                className={`arabic-text transition-colors ${
                  location.pathname === '/audio' 
                    ? 'text-green-600 font-semibold' 
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                المكتبة الصوتية
              </Link>
              <Link 
                to="/video" 
                className={`arabic-text transition-colors ${
                  location.pathname === '/video' 
                    ? 'text-green-600 font-semibold' 
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                المكتبة المرئية
              </Link>
              <Link 
                to="/tests" 
                className={`arabic-text transition-colors ${
                  location.pathname === '/tests' 
                    ? 'text-green-600 font-semibold' 
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                الاختبارات التفاعلية
              </Link>
              <Link 
                to="/search" 
                className={`arabic-text transition-colors ${
                  location.pathname === '/search' 
                    ? 'text-green-600 font-semibold' 
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                البحث الذكي
              </Link>
              <Link 
                to="/duas" 
                className={`arabic-text transition-colors ${
                  location.pathname === '/duas' 
                    ? 'text-green-600 font-semibold' 
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                الأدعية
              </Link>
              <Link 
                to="/calendar" 
                className={`arabic-text transition-colors ${
                  location.pathname === '/calendar' 
                    ? 'text-green-600 font-semibold' 
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                التقويم الهجري
              </Link>
              <Link 
                to="/qibla" 
                className={`arabic-text transition-colors ${
                  location.pathname === '/qibla' 
                    ? 'text-green-600 font-semibold' 
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                اتجاه القبلة
              </Link>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm" className="arabic-text">
                      <User className="h-4 w-4 ml-2" />
                      {user.name}
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={logout}
                    className="arabic-text"
                  >
                    تسجيل الخروج
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowAuthModal(true)}
                  className="arabic-text"
                >
                  <LogIn className="h-4 w-4 ml-2" />
                  تسجيل الدخول
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="title-text text-xl font-bold mb-4">الإسلام حياة</h3>
            <p className="arabic-text text-gray-300 leading-relaxed">
              موقع إسلامي شامل يهدف إلى تقديم المحتوى الإسلامي الصحيح بطريقة سهلة وميسرة.
            </p>
          </div>
          <div>
            <h3 className="title-text text-xl font-bold mb-4">روابط سريعة</h3>
            <div className="space-y-2">
              <Link to="/quran" className="arabic-text block text-gray-300 hover:text-white transition-colors">
                القرآن الكريم
              </Link>
              <Link to="/hadith" className="arabic-text block text-gray-300 hover:text-white transition-colors">
                الحديث الشريف
              </Link>
              <Link to="/azkar" className="arabic-text block text-gray-300 hover:text-white transition-colors">
                الأذكار
              </Link>
              <Link to="/duas" className="arabic-text block text-gray-300 hover:text-white transition-colors">
                الأدعية
              </Link>
            </div>
          </div>
          <div>
            <h3 className="title-text text-xl font-bold mb-4">المصادر</h3>
            <div className="space-y-2">
              <a href="#" className="arabic-text block text-gray-300 hover:text-white transition-colors">
                API القرآن الكريم
              </a>
              <a href="#" className="arabic-text block text-gray-300 hover:text-white transition-colors">
                موقع الدرر السنية
              </a>
              <a href="#" className="arabic-text block text-gray-300 hover:text-white transition-colors">
                حصن المسلم
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="arabic-text text-gray-300">
            جميع الحقوق محفوظة © 2025 الإسلام حياة
          </p>
        </div>
      </div>
    </footer>
  )
}

// Placeholder components for other pages
function ComingSoon({ title }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="title-text text-4xl font-bold text-gray-800 mb-4">{title}</h1>
        <p className="arabic-text text-xl text-gray-600 mb-8">قريباً إن شاء الله</p>
        <Link to="/">
          <Button className="arabic-text">العودة للصفحة الرئيسية</Button>
        </Link>
      </div>
    </div>
  )
}

function App() {
  const [isDark, setIsDark] = useState(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      return savedTheme === 'dark'
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    // Update localStorage when theme changes
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    // Update document class
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(prev => !prev)
  }

  return (
    <AuthProvider>
      <Router>
        <div className={`min-h-screen ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
          <Navigation isDark={isDark} toggleTheme={toggleTheme} />
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quran" element={<QuranReader />} />
            <Route path="/quran/:surahNumber" element={<QuranReader />} />
            <Route path="/hadith" element={<HadithCollection />} />
            <Route path="/scholars" element={<ScholarsEncyclopedia />} />
            <Route path="/audio" element={<AudioLibrary />} />
            <Route path="/video" element={<VideoLibrary />} />
            <Route path="/tests" element={<InteractiveTests />} />
            <Route path="/search" element={<SmartSearch />} />
            <Route path="/azkar" element={<AzkarPage />} />
            <Route path="/duas" element={<DuasPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/qibla" element={<QiblaAndPrayerTimes />} />
            <Route path="/dashboard" element={<UserDashboard />} />
          </Routes>
          
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

