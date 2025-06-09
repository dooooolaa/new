import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Calendar as CalendarIcon, Clock, MapPin, Moon } from 'lucide-react';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hijriDate, setHijriDate] = useState('');
  const [prayerTimes, setPrayerTimes] = useState({});
  const [islamicEvents, setIslamicEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Convert to Hijri date (simplified calculation)
    const convertToHijri = (gregorianDate) => {
      // This is a simplified conversion - in a real app, you'd use a proper library
      const hijriYear = gregorianDate.getFullYear() - 579;
      const months = [
        'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الثانية',
        'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
      ];
      const hijriMonth = months[gregorianDate.getMonth()];
      const hijriDay = gregorianDate.getDate();
      
      return `${hijriDay} ${hijriMonth} ${hijriYear} هـ`;
    };

    // Get prayer times (mock data - in real app, use an API)
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
  }, [currentDate]);

  const formatDate = (date) => {
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
  };

  const getCurrentPrayer = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const prayers = [
      { name: 'الفجر', time: prayerTimes.fajr },
      { name: 'الشروق', time: prayerTimes.sunrise },
      { name: 'الظهر', time: prayerTimes.dhuhr },
      { name: 'العصر', time: prayerTimes.asr },
      { name: 'المغرب', time: prayerTimes.maghrib },
      { name: 'العشاء', time: prayerTimes.isha }
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
  };

  const currentPrayer = getCurrentPrayer();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="arabic-text text-lg text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="title-text text-4xl font-bold text-gray-800 mb-4">
            التقويم الهجري
          </h1>
          <p className="arabic-text text-xl text-gray-600">
            التقويم الهجري مع أوقات الصلاة والمناسبات الإسلامية
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Date Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <CalendarIcon className="text-green-600 ml-2" size={32} />
                  <h2 className="title-text text-2xl font-bold text-gray-800">
                    التاريخ اليوم
                  </h2>
                </div>
                
                <div className="space-y-3">
                  <p className="arabic-text text-xl text-gray-700">
                    {formatDate(currentDate)}
                  </p>
                  <p className="title-text text-2xl font-bold text-green-600">
                    {hijriDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Prayer Times */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center mb-6">
                <Clock className="text-green-600 ml-2" size={24} />
                <h3 className="title-text text-xl font-bold text-gray-800">
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
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <p className="arabic-text font-semibold text-gray-800 mb-1">
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
                <p className="arabic-text text-center text-gray-700">
                  الصلاة القادمة: <span className="font-bold text-green-600">{currentPrayer.next.name}</span> في {currentPrayer.next.time}
                </p>
              </div>
            </div>
          </div>

          {/* Islamic Events Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-6">
                <Moon className="text-green-600 ml-2" size={24} />
                <h3 className="title-text text-xl font-bold text-gray-800">
                  المناسبات الإسلامية
                </h3>
              </div>
              
              <div className="space-y-4">
                {islamicEvents.map((event, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                    <p className="arabic-text font-semibold text-gray-800 mb-1">
                      {event.date}
                    </p>
                    <p className="arabic-text text-sm text-gray-600">
                      {event.event}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Settings */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <div className="flex items-center mb-4">
                <MapPin className="text-green-600 ml-2" size={24} />
                <h3 className="title-text text-xl font-bold text-gray-800">
                  الموقع
                </h3>
              </div>
              
              <p className="arabic-text text-gray-600 mb-4">
                أوقات الصلاة محسوبة لمدينة القاهرة، مصر
              </p>
              
              <Button 
                variant="outline" 
                className="arabic-text w-full"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        console.log('Location:', position.coords);
                        // Here you would update prayer times based on location
                      },
                      (error) => {
                        console.error('Location error:', error);
                      }
                    );
                  }
                }}
              >
                تحديد الموقع الحالي
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;

