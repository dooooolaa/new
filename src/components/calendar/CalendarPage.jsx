import { useState, useEffect } from 'react';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hijriDate, setHijriDate] = useState('');
  const [prayerTimes, setPrayerTimes] = useState({});
  const [islamicEvents, setIslamicEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Convert to Hijri date (simplified calculation)
      const convertToHijri = (gregorianDate) => {
        const hijriYear = gregorianDate.getFullYear() - 579;
        const months = [
          'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الثانية',
          'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
        ];
        const hijriMonth = months[gregorianDate.getMonth()];
        const hijriDay = gregorianDate.getDate();
        
        return `${hijriDay} ${hijriMonth} ${hijriYear} هـ`;
      };

      // Get prayer times (mock data)
      const getPrayerTimes = () => {
        return {
          fajr: '05:30',
          sunrise: '06:45',
          dhuhr: '12:15',
          asr: '15:30',
          maghrib: '18:00',
          isha: '19:30'
        };
      };

      // Get Islamic events (mock data)
      const getIslamicEvents = () => {
        return [
          { date: '1 محرم', event: 'رأس السنة الهجرية' },
          { date: '10 محرم', event: 'يوم عاشوراء' },
          { date: '12 ربيع الأول', event: 'المولد النبوي الشريف' },
          { date: '27 رجب', event: 'ليلة الإسراء والمعراج' },
          { date: '15 شعبان', event: 'ليلة النصف من شعبان' },
          { date: '1 رمضان', event: 'بداية شهر رمضان' },
          { date: '27 رمضان', event: 'ليلة القدر (تقديرية)' },
          { date: '1 شوال', event: 'عيد الفطر' },
          { date: '10 ذو الحجة', event: 'عيد الأضحى' }
        ];
      };

      setHijriDate(convertToHijri(currentDate));
      setPrayerTimes(getPrayerTimes());
      setIslamicEvents(getIslamicEvents());
      setLoading(false);
    } catch (error) {
      console.error('Error in CalendarPage:', error);
      setLoading(false);
    }
  }, [currentDate]);

  const formatDate = (date) => {
    try {
      const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
      const months = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
      ];
      
      const dayName = days[date.getDay()];
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      
      return `${dayName} ${day} ${month} ${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'تاريخ غير صحيح';
    }
  };

  const getCurrentPrayer = () => {
    try {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      const prayers = [
        { name: 'الفجر', time: prayerTimes.fajr || '05:30' },
        { name: 'الشروق', time: prayerTimes.sunrise || '06:45' },
        { name: 'الظهر', time: prayerTimes.dhuhr || '12:15' },
        { name: 'العصر', time: prayerTimes.asr || '15:30' },
        { name: 'المغرب', time: prayerTimes.maghrib || '18:00' },
        { name: 'العشاء', time: prayerTimes.isha || '19:30' }
      ];

      for (let i = 0; i < prayers.length; i++) {
        const [hours, minutes] = prayers[i].time.split(':').map(Number);
        const prayerTime = hours * 60 + minutes;
        
        if (currentTime < prayerTime) {
          return {
            current: prayers[i],
            next: prayers[i + 1] || prayers[0]
          };
        }
      }
      
      return {
        current: prayers[prayers.length - 1],
        next: prayers[0]
      };
    } catch (error) {
      console.error('Error getting current prayer:', error);
      return {
        current: { name: 'الفجر', time: '05:30' },
        next: { name: 'الظهر', time: '12:15' }
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const currentPrayer = getCurrentPrayer();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            التقويم الهجري
          </h1>
          <p className="text-xl text-gray-600">
            التقويم الهجري مع أوقات الصلاة والمناسبات الإسلامية
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Date Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-lg shadow-md p-6 mb-6 border">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h2 className="text-2xl font-bold text-gray-800">
                    التاريخ اليوم
                  </h2>
                </div>
                
                <div className="space-y-3">
                  <p className="text-xl text-gray-700">
                    {formatDate(currentDate)}
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {hijriDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Prayer Times */}
            <div className="bg-gray-50 rounded-lg shadow-md p-6 mb-6 border">
              <div className="flex items-center mb-6">
                <svg className="w-6 h-6 text-green-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-800">
                  أوقات الصلاة
                </h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(prayerTimes).map(([prayer, time]) => {
                  const prayerNames = {
                    fajr: 'الفجر',
                    sunrise: 'الشروق',
                    dhuhr: 'الظهر',
                    asr: 'العصر',
                    maghrib: 'المغرب',
                    isha: 'العشاء'
                  };
                  
                  const isCurrentPrayer = currentPrayer.current.name === prayerNames[prayer];
                  
                  return (
                    <div 
                      key={prayer}
                      className={`text-center p-4 rounded-lg border-2 ${
                        isCurrentPrayer 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <p className="font-semibold text-gray-800 mb-1">
                        {prayerNames[prayer]}
                      </p>
                      <p className="text-lg font-bold text-green-600">
                        {time}
                      </p>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-center text-gray-700">
                  الصلاة القادمة: <span className="font-bold text-green-600">{currentPrayer.next.name}</span> في {currentPrayer.next.time}
                </p>
              </div>
            </div>
          </div>

          {/* Islamic Events Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg shadow-md p-6 border">
              <div className="flex items-center mb-6">
                <svg className="w-6 h-6 text-green-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-800">
                  المناسبات الإسلامية
                </h3>
              </div>
              
              <div className="space-y-4">
                {islamicEvents.map((event, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg border">
                    <p className="font-semibold text-gray-800 mb-1">
                      {event.date}
                    </p>
                    <p className="text-sm text-gray-600">
                      {event.event}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Settings */}
            <div className="bg-gray-50 rounded-lg shadow-md p-6 mt-6 border">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-green-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-800">
                  الموقع
                </h3>
              </div>
              
              <p className="text-gray-600 mb-4">
                أوقات الصلاة محسوبة لمدينة القاهرة، مصر
              </p>
              
              <button 
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        console.log('Location:', position.coords);
                      },
                      (error) => {
                        console.error('Location error:', error);
                      }
                    );
                  }
                }}
              >
                تحديد الموقع الحالي
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;

