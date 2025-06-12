import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { ChevronLeft, ChevronRight, Play, Pause, Volume2 } from 'lucide-react'

const QuranReader = () => {
  const [currentSurah, setCurrentSurah] = useState(1)
  const [surahData, setSurahData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Fetch surah data from API
  const fetchSurah = async (surahNumber) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`http://api.alquran.cloud/v1/surah/${surahNumber}`)
      const data = await response.json()
      
      if (data.code === 200) {
        setSurahData(data.data)
      } else {
        setError('فشل في تحميل السورة')
      }
    } catch (err) {
      setError('خطأ في الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSurah(currentSurah)
  }, [currentSurah])

  const nextSurah = () => {
    if (currentSurah < 114) {
      setCurrentSurah(currentSurah + 1)
    }
  }

  const prevSurah = () => {
    if (currentSurah > 1) {
      setCurrentSurah(currentSurah - 1)
    }
  }

  const toggleAudio = () => {
    setIsPlaying(!isPlaying)
    // Audio functionality would be implemented here
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="arabic-text text-gray-600">جاري تحميل السورة...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="arabic-text text-red-600 mb-4">{error}</p>
          <Button onClick={() => fetchSurah(currentSurah)} className="arabic-text">
            إعادة المحاولة
          </Button>
        </div>
      </div>
    )
  }

  if (!surahData) return null

  // Check if this surah starts with Basmala (all except Surah 9)
  const hasBasmala = currentSurah !== 9
  const verses = surahData.ayahs || []
  
  // If surah has Basmala, separate it from other verses
  const basmalaVerse = hasBasmala ? verses[0] : null
  const otherVerses = hasBasmala ? verses.slice(1) : verses

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={prevSurah}
                disabled={currentSurah === 1}
                className="arabic-text"
              >
                <ChevronRight className="h-4 w-4 ml-2" />
                السورة السابقة
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextSurah}
                disabled={currentSurah === 114}
                className="arabic-text"
              >
                السورة التالية
                <ChevronLeft className="h-4 w-4 mr-2" />
              </Button>
            </div>
            
            <div className="text-center">
              <h1 className="title-text text-2xl font-bold text-gray-800">
                {surahData.name}
              </h1>
              <p className="arabic-text text-sm text-gray-600">
                {surahData.englishName} - {surahData.numberOfAyahs} آية
              </p>
            </div>

<<<<<<< HEAD
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAudio}
              className="arabic-text"
            >
              {isPlaying ? <Pause className="h-4 w-4 ml-2" /> : <Play className="h-4 w-4 ml-2" />}
              {isPlaying ? 'إيقاف' : 'تشغيل'}
            </Button>
          </div>
        </div>
      </div>
=======
      
      <SurahPlayer
        surahName={surah.englishName}
        reciterName="رعد محمد الكردي"
        reciterImg="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPtLFfPujGfBxXLu2E5zqjiy-vo11bAMjGdQ&s"
        audioSrc="https://server6.mp3quran.net/kurdi"
        onPrev={() => navigate(`/quran/${+surahNumber - 1}`)}
        onNext={() => navigate(`/quran/${+surahNumber + 1}`)}
      />
>>>>>>> 8c3f3e110c1704368ac6a1944d88ff732592783a

      {/* Surah Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Surah Header */}
        <div className="text-center mb-8 p-6 bg-gray-50 rounded-lg">
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-green-500 text-white rounded-full arabic-text text-sm">
              سورة رقم {currentSurah}
            </span>
          </div>
          <h2 className="title-text text-3xl font-bold text-gray-800 mb-2">
            {surahData.name}
          </h2>
          <p className="arabic-text text-gray-600 mb-2">
            {surahData.englishNameTranslation} - {surahData.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
          </p>
          <p className="arabic-text text-sm text-gray-500">
            {surahData.numberOfAyahs} آية
          </p>
        </div>

<<<<<<< HEAD
        {/* Basmala */}
        {hasBasmala && basmalaVerse && (
          <div className="text-center mb-12 p-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-yellow-600 text-white rounded-full text-sm arabic-text">
                البسملة
              </span>
            </div>
            <p className="basmala text-3xl md:text-4xl leading-relaxed">
              {basmalaVerse.text}
            </p>
            <div className="mt-4">
              <span className="verse-number">
                {basmalaVerse.numberInSurah}
              </span>
            </div>
          </div>
        )}

        {/* Verses */}
        <div className="space-y-6">
          {otherVerses.map((verse) => (
            <div
              key={verse.number}
              className="p-6 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="text-center mb-4">
                <p className="quran-text text-2xl md:text-3xl leading-loose text-gray-800">
                  {verse.text}
                </p>
              </div>
              <div className="flex items-center justify-center space-x-4">
                <span className="verse-number">
                  {verse.numberInSurah}
                </span>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span className="arabic-text">الجزء {verse.juz}</span>
                  <span>•</span>
                  <span className="arabic-text">الصفحة {verse.page}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t">
          <Button
            onClick={prevSurah}
            disabled={currentSurah === 1}
            variant="outline"
            className="arabic-text"
          >
            <ChevronRight className="h-4 w-4 ml-2" />
            السورة السابقة
          </Button>
          
          <div className="text-center">
            <p className="arabic-text text-sm text-gray-600">
              سورة {currentSurah} من 114
            </p>
          </div>

          <Button
            onClick={nextSurah}
            disabled={currentSurah === 114}
            variant="outline"
            className="arabic-text"
          >
            السورة التالية
            <ChevronLeft className="h-4 w-4 mr-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default QuranReader

=======
      <AyahViewer
        ayahs={(surah.ayahs || []).slice(0, 19)}
        onPrevAyah={() => {}}
        onNextAyah={() => {}}
      />
    </div>
  );
}
>>>>>>> 8c3f3e110c1704368ac6a1944d88ff732592783a
