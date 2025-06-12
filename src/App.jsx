import { useState, createContext, useContext, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Moon, Sun, Book, Heart, Calendar, Compass, MessageSquare, Clock, User, LogIn } from 'lucide-react'
import QuranReader from './components/quran/QuranReader.jsx'
import QuranPage from './components/quran/QuranPage.tsx'
import QiblaAndPrayerTimes from './components/qibla/QiblaAndPrayerTimes.jsx'
import HadithCollection from './components/hadith/HadithCollection.jsx'
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

// Theme Context
const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : false
  })

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

function HomePage() {
  const sections = [
    {
      title: "القرآن الكريم",
      description: "تصفح القرآن الكريم كاملاً مع تفسير الآيات",
      icon: Book,
      color: "from-blue-500 to-purple-600",
      link: "/quran"
    },
    {
      title: "الحديث الشريف",
      description: "مجموعة من الأحاديث النبوية الصحيحة مصنفة",
      icon: MessageSquare,
      color: "from-red-500 to-pink-600",
      link: "/hadith"
    },
    {
      title: "الأذكار",
      description: "أذكار الصباح والمساء وأذكار بعد الصلاة وأذكار",
      icon: Heart,
      color: "from-green-500 to-emerald-600",
      link: "/azkar"
    },
    {
      title: "الأدعية",
      description: "مجموعة شاملة من الأدعية المأثورة",
      icon: Heart,
      color: "from-pink-500 to-rose-600",
      link: "/duas"
    },
    {
      title: "التقويم الهجري",
      description: "التقويم الهجري مع أوقات الصلاة والمناسبات",
      icon: Calendar,
      color: "from-orange-500 to-yellow-600",
      link: "/calendar"
    },
    {
      title: "اتجاه القبلة",
      description: "تحديد اتجاه القبلة وأوقات الصلاة",
      icon: Compass,
      color: "from-teal-500 to-cyan-600",
      link: "/qibla"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6">
            الإسلام حياة
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            موقع إسلامي شامل يجمع القرآن الكريم والأحاديث النبوية والأذكار والأدعية والمزيد
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/quran" 
              className="inline-flex items-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
            >
              <Book className="ml-2" size={20} />
              تصفح القرآن الكريم
            </Link>
            <Link 
              to="/azkar" 
              className="inline-flex items-center px-8 py-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
            >
              <Heart className="ml-2" size={20} />
              الأذكار اليومية
            </Link>
          </div>
        </div>

        {/* Daily Reminder */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-16 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              احرص على قراءة القرآن وذكر الله كل يوم
            </h2>
            <p className="text-xl text-green-600 dark:text-green-400 font-semibold">
              قال تعالى: ﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾
            </p>
          </div>
        </div>

        {/* Sections Grid */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">
            أقسام الموقع
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section, index) => {
              const IconComponent = section.icon
              return (
                <Link
                  key={index}
                  to={section.link}
                  className="group relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                  <div className="relative p-8 text-white">
                    <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 mx-auto">
                      <IconComponent size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-center mb-4">
                      {section.title}
                    </h3>
                    <p className="text-center text-white/90 leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function Navigation() {
  const { isDarkMode, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const location = useLocation()

  const navItems = [
    { name: 'الإسلام حياة', path: '/', icon: null },
    { name: 'القرآن الكريم', path: '/quran', icon: Book },
    { name: 'الحديث الشريف', path: '/hadith', icon: MessageSquare },
    { name: 'الأذكار', path: '/azkar', icon: Heart },
    { name: 'موسوعة العلماء', path: '/scholars', icon: User },
    { name: 'المكتبة الصوتية', path: '/audio', icon: null },
    { name: 'المكتبة المرئية', path: '/video', icon: null },
    { name: 'الاختبارات التفاعلية', path: '/tests', icon: null },
    { name: 'البحث الذكي', path: '/search', icon: null },
    { name: 'الأدعية', path: '/duas', icon: Heart },
    { name: 'التقويم الهجري', path: '/calendar', icon: Calendar },
    { name: 'اتجاه القبلة', path: '/qibla', icon: Compass }
  ]

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">إ</span>
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-white hidden sm:block">
              الإسلام حياة
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.slice(1, 6).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Auth */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                >
                  <User size={16} />
                  <span className="hidden sm:block">{user.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  خروج
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <LogIn size={16} />
                <span className="hidden sm:block">تسجيل الدخول</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 py-2">
          <div className="flex flex-wrap gap-2">
            {navItems.slice(1, 13).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </nav>
  )
}

function ComingSoon({ title }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          {title}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          هذا القسم قيد التطوير وسيكون متاحاً قريباً إن شاء الله
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
        >
          العودة للصفحة الرئيسية
        </Link>
      </div>
    </div>
  )
}

function AppContent() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quran" element={<QuranPage />} />
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
      </main>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

