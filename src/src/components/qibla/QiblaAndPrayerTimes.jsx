import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { MapPin, Clock, Compass, Navigation, RefreshCw, AlertCircle } from 'lucide-react'

const QiblaAndPrayerTimes = () => {
  const [location, setLocation] = useState(null)
  const [prayerTimes, setPrayerTimes] = useState(null)
  const [qiblaDirection, setQiblaDirection] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [nextPrayer, setNextPrayer] = useState(null)
  const [timeToNextPrayer, setTimeToNextPrayer] = useState('')

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Calculate next prayer and time remaining
  useEffect(() => {
    if (prayerTimes) {
      calculateNextPrayer()
    }
  }, [prayerTimes, currentTime])

  const calculateNextPrayer = () => {
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    
    const prayers = [
      { name: 'الفجر', time: prayerTimes.Fajr, key: 'Fajr' },
      { name: 'الظهر', time: prayerTimes.Dhuhr, key: 'Dhuhr' },
      { name: 'العصر', time: prayerTimes.Asr, key: 'Asr' },
      { name: 'المغرب', time: prayerTimes.Maghrib, key: 'Maghrib' },
      { name: 'العشاء', time: prayerTimes.Isha, key: 'Isha' }
    ]

    let nextPrayerInfo = null
    let minTimeDiff = Infinity

    prayers.forEach(prayer => {
      const prayerDateTime = new Date(`${today}T${prayer.time}:00`)
      const timeDiff = prayerDateTime.getTime() - now.getTime()
      
      if (timeDiff > 0 && timeDiff < minTimeDiff) {
        minTimeDiff = timeDiff
        nextPrayerInfo = prayer
      }
    })

    // If no prayer found for today, get Fajr for tomorrow
    if (!nextPrayerInfo) {
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowStr = tomorrow.toISOString().split('T')[0]
      const fajrTomorrow = new Date(`${tomorrowStr}T${prayerTimes.Fajr}:00`)
      minTimeDiff = fajrTomorrow.getTime() - now.getTime()
      nextPrayerInfo = { name: 'الفجر', time: prayerTimes.Fajr, key: 'Fajr' }
    }

    setNextPrayer(nextPrayerInfo)

    // Calculate time remaining
    const hours = Math.floor(minTimeDiff / (1000 * 60 * 60))
    const minutes = Math.floor((minTimeDiff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((minTimeDiff % (1000 * 60)) / 1000)
    
    setTimeToNextPrayer(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
  }

  const getCurrentLocation = () => {
    setLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError('الموقع الجغرافي غير مدعوم في هذا المتصفح')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setLocation({ latitude, longitude })
        await fetchPrayerTimes(latitude, longitude)
        calculateQiblaDirection(latitude, longitude)
      },
      (error) => {
        setError('فشل في الحصول على الموقع الجغرافي')
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }

  const fetchPrayerTimes = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `http://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
      )
      const data = await response.json()
      
      if (data.code === 200) {
        setPrayerTimes(data.data.timings)
      } else {
        setError('فشل في تحميل مواقيت الصلاة')
      }
    } catch (err) {
      setError('خطأ في الاتصال بخادم مواقيت الصلاة')
    } finally {
      setLoading(false)
    }
  }

  const calculateQiblaDirection = (latitude, longitude) => {
    // Kaaba coordinates
    const kaabaLat = 21.4225
    const kaabaLng = 39.8262

    // Convert to radians
    const lat1 = latitude * Math.PI / 180
    const lat2 = kaabaLat * Math.PI / 180
    const deltaLng = (kaabaLng - longitude) * Math.PI / 180

    // Calculate bearing
    const y = Math.sin(deltaLng) * Math.cos(lat2)
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng)
    
    let bearing = Math.atan2(y, x) * 180 / Math.PI
    bearing = (bearing + 360) % 360 // Normalize to 0-360

    setQiblaDirection(bearing)
  }

  const formatTime = (time) => {
    return time.replace(/(\d{2}):(\d{2})/, '$1:$2')
  }

  const PrayerTimeCard = ({ name, time, isNext = false }) => (
    <div className={`p-4 rounded-lg border-2 transition-all ${
      isNext 
        ? 'border-green-500 bg-green-50 shadow-lg' 
        : 'border-gray-200 bg-white hover:border-green-300'
    }`}>
      <div className="text-center">
        <h3 className={`arabic-text text-lg font-bold mb-2 ${
          isNext ? 'text-green-700' : 'text-gray-800'
        }`}>
          {name}
        </h3>
        <p className={`text-2xl font-mono ${
          isNext ? 'text-green-600' : 'text-gray-600'
        }`}>
          {formatTime(time)}
        </p>
        {isNext && (
          <div className="mt-2">
            <span className="inline-block px-2 py-1 bg-green-500 text-white text-xs rounded-full arabic-text">
              الصلاة القادمة
            </span>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="title-text text-3xl font-bold text-gray-800 mb-2">
              اتجاه القبلة ومواقيت الصلاة
            </h1>
            <p className="arabic-text text-gray-600">
              تحديد اتجاه القبلة ومواقيت الصلاة حسب موقعك الحالي
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Location Button */}
        {!location && (
          <div className="text-center mb-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <MapPin className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="title-text text-2xl font-bold text-gray-800 mb-4">
                تحديد الموقع
              </h2>
              <p className="arabic-text text-gray-600 mb-6">
                للحصول على مواقيت الصلاة واتجاه القبلة الدقيق، يرجى السماح بالوصول إلى موقعك الجغرافي
              </p>
              <Button
                onClick={getCurrentLocation}
                disabled={loading}
                size="lg"
                className="arabic-text bg-green-500 hover:bg-green-600"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    جاري تحديد الموقع...
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4 mr-2" />
                    تحديد موقعي
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8">
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                <p className="arabic-text text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {location && prayerTimes && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Qibla Direction */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                <h2 className="title-text text-2xl font-bold text-gray-800 mb-2">
                  اتجاه القبلة
                </h2>
                <p className="arabic-text text-gray-600">
                  الاتجاه نحو الكعبة المشرفة
                </p>
              </div>

              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                  <div className="absolute inset-4 rounded-full border-2 border-gray-100"></div>
                  
                  {/* Compass needle */}
                  <div 
                    className="absolute top-1/2 left-1/2 w-1 h-20 bg-green-500 origin-bottom transform -translate-x-1/2 -translate-y-full transition-transform duration-1000"
                    style={{ transform: `translate(-50%, -100%) rotate(${qiblaDirection || 0}deg)` }}
                  >
                    <div className="absolute -top-2 -left-1 w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  
                  {/* Center dot */}
                  <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-gray-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                  
                  {/* Direction labels */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-sm font-bold text-gray-600">ش</div>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-sm font-bold text-gray-600">ج</div>
                  <div className="absolute top-1/2 left-2 transform -translate-y-1/2 text-sm font-bold text-gray-600">غ</div>
                  <div className="absolute top-1/2 right-2 transform -translate-y-1/2 text-sm font-bold text-gray-600">ق</div>
                </div>

                <div className="space-y-2">
                  <p className="arabic-text text-lg">
                    <span className="font-bold text-green-600">
                      {qiblaDirection ? `${Math.round(qiblaDirection)}°` : '--°'}
                    </span>
                  </p>
                  <p className="arabic-text text-sm text-gray-600">
                    الاتجاه من الشمال
                  </p>
                </div>
              </div>
            </div>

            {/* Next Prayer Countdown */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                <h2 className="title-text text-2xl font-bold text-gray-800 mb-2">
                  الصلاة القادمة
                </h2>
                <p className="arabic-text text-gray-600">
                  الوقت المتبقي حتى الصلاة القادمة
                </p>
              </div>

              {nextPrayer && (
                <div className="text-center">
                  <div className="mb-6">
                    <Clock className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="title-text text-3xl font-bold text-green-600 mb-2">
                      {nextPrayer.name}
                    </h3>
                    <p className="text-2xl font-mono text-gray-600 mb-4">
                      {formatTime(nextPrayer.time)}
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="arabic-text text-sm text-gray-600 mb-2">
                      الوقت المتبقي
                    </p>
                    <p className="text-3xl font-mono font-bold text-green-600">
                      {timeToNextPrayer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Prayer Times Grid */}
        {prayerTimes && (
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="title-text text-2xl font-bold text-gray-800 mb-6 text-center">
                مواقيت الصلاة اليوم
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <PrayerTimeCard 
                  name="الفجر" 
                  time={prayerTimes.Fajr} 
                  isNext={nextPrayer?.key === 'Fajr'}
                />
                <PrayerTimeCard 
                  name="الظهر" 
                  time={prayerTimes.Dhuhr} 
                  isNext={nextPrayer?.key === 'Dhuhr'}
                />
                <PrayerTimeCard 
                  name="العصر" 
                  time={prayerTimes.Asr} 
                  isNext={nextPrayer?.key === 'Asr'}
                />
                <PrayerTimeCard 
                  name="المغرب" 
                  time={prayerTimes.Maghrib} 
                  isNext={nextPrayer?.key === 'Maghrib'}
                />
                <PrayerTimeCard 
                  name="العشاء" 
                  time={prayerTimes.Isha} 
                  isNext={nextPrayer?.key === 'Isha'}
                />
              </div>

              <div className="mt-6 text-center">
                <Button
                  onClick={getCurrentLocation}
                  variant="outline"
                  className="arabic-text"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  تحديث المواقيت
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Current Time */}
        <div className="mt-8 text-center">
          <div className="bg-gray-50 rounded-lg p-4 inline-block">
            <p className="arabic-text text-sm text-gray-600 mb-1">الوقت الحالي</p>
            <p className="text-xl font-mono text-gray-800">
              {currentTime.toLocaleTimeString('ar-SA', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QiblaAndPrayerTimes

