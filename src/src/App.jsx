import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Moon, Sun, Book, Heart, Calendar, Compass, MessageSquare, Clock, User, LogIn } from 'lucide-react'
import QuranReader from './components/quran/QuranReader.jsx'
import QiblaAndPrayerTimes from './components/qibla/QiblaAndPrayerTimes.jsx'
import HadithCollection from './components/hadith/HadithCollection.jsx'
import ScholarsEncyclopedia from './components/scholars/ScholarsEncyclopedia.jsx'
import AudioLibrary from './components/media/AudioLibrary.jsx'
import VideoLibrary from './components/media/VideoLibrary.jsx'
import InteractiveTests from './components/tests/InteractiveTests.jsx'
import SmartSearch from './components/search/SmartSearch.jsx'
import UserDashboard from './components/dashboard/UserDashboard.jsx'
import AuthModal from './components/auth/AuthModal.jsx'
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
      description: 'التقويم الهجري مع المناسبات الإسلامية والأيام الفضيلة',
      icon: Calendar,
      color: 'orange',
      link: '/calendar'
    },
    {
      id: 'qibla',
      title: 'اتجاه القبلة',
      description: 'تحديد اتجاه القبلة بناء على موقعك الحالي',
      icon: Compass,
      color: 'purple',
      link: '/qibla'
    }
  ]

  const SectionCard = ({ section }) => {
    const IconComponent = section.icon
    return (
      <Link to={section.link} className="block">
        <div className={`islamic-card islamic-card-${section.color} group cursor-pointer hover:scale-105 transition-transform`}>
          <div className={`islamic-icon islamic-icon-${section.color}`}>
            <IconComponent size={32} />
          </div>
          <h3 className="arabic-text text-xl font-bold mb-3 text-center">
            {section.title}
          </h3>
          <p className="arabic-text text-gray-600 text-center mb-4 leading-relaxed">
            {section.description}
          </p>
          <div className="text-center">
            <Button variant="outline" className="arabic-text">
              تصفح القسم ←
            </Button>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="title-text text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            الإسلام حياة
          </h2>
          <p className="arabic-text text-xl text-gray-600 mb-8">
            موقع إسلامي شامل يجمع القرآن الكريم والأحاديث النبوية والأذكار والأدعية والمزيد
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/quran">
              <Button size="lg" className="arabic-text bg-green-500 hover:bg-green-600">
                تصفح القرآن الكريم
              </Button>
            </Link>
            <Link to="/azkar">
              <Button size="lg" variant="outline" className="arabic-text">
                الأذكار اليومية
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Sections */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="title-text text-3xl font-bold text-center mb-12 text-gray-800">
            أقسام الموقع
          </h2>
          <div className="section-grid">
            {sections.map((section) => (
              <SectionCard key={section.id} section={section} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="call-to-action-section">
        <div className="max-w-4xl mx-auto">
          <h2 className="title-text text-3xl md:text-4xl font-bold mb-6">
            احرص على قراءة القرآن وذكر الله كل يوم
          </h2>
          <p className="quran-text text-xl mb-8">
            قال تعالى: ﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/quran">
              <Button size="lg" variant="secondary" className="arabic-text bg-white text-green-600 hover:bg-gray-100">
                ابدأ بقراءة القرآن
              </Button>
            </Link>
            <Link to="/azkar">
              <Button size="lg" variant="outline" className="arabic-text border-white text-white hover:bg-white hover:text-green-600">
                اقرأ الأذكار اليومية
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

function Navigation({ isDark, toggleTheme }) {
  const location = useLocation()
  const { user, logout } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  
  return (
    <>
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="title-text text-2xl font-bold text-green-600">
                الإسلام حياة
              </Link>
              <div className="hidden md:flex space-x-6">
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
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link to="/dashboard">
                    <Button variant="ghost" className="arabic-text">
                      <User className="h-4 w-4 mr-2" />
                      {user.name}
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={logout}
                    className="arabic-text text-red-600 hover:text-red-700"
                  >
                    تسجيل الخروج
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => setShowAuthModal(true)}
                  className="arabic-text"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  تسجيل الدخول
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="ml-4"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
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
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="title-text text-xl font-bold mb-4">الإسلام حياة</h3>
            <p className="arabic-text text-gray-300">
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
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Navigation isDark={isDark} toggleTheme={toggleTheme} />
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quran" element={<QuranReader />} />
            <Route path="/hadith" element={<HadithCollection />} />
            <Route path="/scholars" element={<ScholarsEncyclopedia />} />
            <Route path="/audio" element={<AudioLibrary />} />
            <Route path="/video" element={<VideoLibrary />} />
            <Route path="/tests" element={<InteractiveTests />} />
            <Route path="/search" element={<SmartSearch />} />
            <Route path="/azkar" element={<ComingSoon title="الأذكار" />} />
            <Route path="/duas" element={<ComingSoon title="الأدعية" />} />
            <Route path="/calendar" element={<ComingSoon title="التقويم الهجري" />} />
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
