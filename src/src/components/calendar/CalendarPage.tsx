import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronRight, ChevronLeft } from 'lucide-react';
import uq, { UmAlQura } from '@umalqura/core';

interface IslamicEvent {
  name: string;
  date: string; // Format: MM-DD for Gregorian, MM-DD for Hijri
  description: string;
  type: 'hijri' | 'gregorian';
}

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hijriDate, setHijriDate] = useState<UmAlQura | any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<IslamicEvent[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<IslamicEvent[]>([]);

  useEffect(() => {
    // Initialize Hijri date using umalqura
    const today = new Date();
    const hijri = uq(today);
    setHijriDate(hijri);
    
    // Load Islamic events
    loadIslamicEvents();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const hijriSelected = uq(selectedDate);
      const selectedDateEvents = getEventsForDate(selectedDate, hijriSelected);
      setSelectedEvents(selectedDateEvents);
    } else {
      setSelectedEvents([]);
    }
  }, [selectedDate, events]);

  const loadIslamicEvents = () => {
    // These are major Islamic events with approximate Hijri dates
    // In a real app, these would be calculated precisely for each year
    const islamicEvents: IslamicEvent[] = [
      {
        name: 'رأس السنة الهجرية',
        date: '01-01', // Muharram 1
        description: 'بداية السنة الهجرية الجديدة',
        type: 'hijri'
      },
      {
        name: 'يوم عاشوراء',
        date: '01-10', // Muharram 10
        description: 'يوم صيام وذكرى استشهاد الإمام الحسين',
        type: 'hijri'
      },
      {
        name: 'المولد النبوي الشريف',
        date: '03-12', // Rabi' al-Awwal 12
        description: 'ذكرى مولد النبي محمد صلى الله عليه وسلم',
        type: 'hijri'
      },
      {
        name: 'بداية شهر رمضان',
        date: '09-01', // Ramadan 1
        description: 'بداية شهر الصيام المبارك',
        type: 'hijri'
      },
      {
        name: 'ليلة القدر',
        date: '09-27', // Ramadan 27 (approximate)
        description: 'الليلة المباركة التي أنزل فيها القرآن',
        type: 'hijri'
      },
      {
        name: 'عيد الفطر',
        date: '10-01', // Shawwal 1
        description: 'عيد الفطر المبارك، نهاية شهر رمضان',
        type: 'hijri'
      },
      {
        name: 'يوم عرفة',
        date: '12-09', // Dhu al-Hijjah 9
        description: 'يوم الوقوف بعرفة، أهم أيام الحج',
        type: 'hijri'
      },
      {
        name: 'عيد الأضحى',
        date: '12-10', // Dhu al-Hijjah 10
        description: 'عيد الأضحى المبارك، ذكرى تضحية النبي إبراهيم',
        type: 'hijri'
      }
    ];
    
    setEvents(islamicEvents);
  };

  const getEventsForDate = (date: Date, hijriDateForDay: UmAlQura): IslamicEvent[] => {
    const gregorianMonth = (date.getMonth() + 1).toString().padStart(2, '0');
    const gregorianDay = date.getDate().toString().padStart(2, '0');
    const gregorianDateStr = `${gregorianMonth}-${gregorianDay}`;
    
    // Get the current Hijri year from the date being displayed
    const currentHijriYear = hijriDateForDay.hy;

    return events.filter(event => {
      if (event.type === 'gregorian') {
        return event.date === gregorianDateStr;
      } else if (event.type === 'hijri') {
        // For Hijri events, calculate their Gregorian date in the current Hijri year
        try {
          const eventHijriMonth = parseInt(event.date.split('-')[0], 10);
          const eventHijriDay = parseInt(event.date.split('-')[1], 10);
          // Create a UmAlQura object for the event in the current year
          // Month in umalqura is 1-indexed
          const eventHijriDate = uq(currentHijriYear, eventHijriMonth, eventHijriDay);
          // Convert the event's Hijri date to Gregorian
          const eventGregorianDate = eventHijriDate.date; // .date property gives the Gregorian Date object
          const eventGregorianMonth = (eventGregorianDate.getMonth() + 1).toString().padStart(2, '0');
          const eventGregorianDay = eventGregorianDate.getDate().toString().padStart(2, '0');
          const eventGregorianDateStr = `${eventGregorianMonth}-${eventGregorianDay}`;
          
          // Compare with the current day's Gregorian date
          return gregorianDateStr === eventGregorianDateStr;
        } catch (e) {
          console.error('Error calculating event date:', e);
          return false;
        }
      }
      return false;
    });
  };

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(selectedDate);
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days: React.ReactNode[] = [];
    const today = new Date();
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const hijriForDay = uq(date);
      const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
      const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === month && selectedDate?.getFullYear() === year;
      
      // Check if this date has any events
      const dateEvents = getEventsForDate(date, hijriForDay);
      const hasEvents = dateEvents.length > 0;
      
      days.push(
        <div 
          key={day} 
          className={`h-10 w-10 flex flex-col items-center justify-center rounded-full cursor-pointer relative
            ${isToday ? 'bg-light-accent dark:bg-dark-accent text-white' : ''}
            ${isSelected && !isToday ? 'bg-gray-200 dark:bg-gray-700' : ''}
            ${!isToday && !isSelected ? 'hover:bg-gray-100 dark:hover:bg-gray-800' : ''}
          `}
          onClick={() => handleDateClick(day)}
        >
          <span>{day}</span>
          {hasEvents && (
            <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-light-accent dark:bg-dark-accent"></div>
          )}
        </div>
      );
    }
    
    return days;
  };

  const formatHijriDate = (date: Date): string => {
    if (!hijriDate) return '';
    
    const hijri = uq(date); // Use uq to get UmAlQura object for the given date
    const hijriMonths = [
      'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
      'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
      'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
    ];
    
    // Format as Day Month (e.g., 24 ذو الحجة)
    return `${hijri.hd} ${hijriMonths[hijri.hm - 1]}`;
  };

  const formatGregorianDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('ar-SA', options);
  };

  return (
    <div className="container-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="section-title">التقويم الهجري</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Calendar Section */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={handlePrevMonth}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-theme"
                aria-label="Previous month"
              >
                <ChevronRight size={20} />
              </button>
              
              <div className="text-center">
                <h2 className="text-xl font-medium">
                  {currentDate.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' })}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatHijriDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))}
                </p>
              </div>
              
              <button 
                onClick={handleNextMonth}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-theme"
                aria-label="Next month"
              >
                <ChevronLeft size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">الأحد</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">الإثنين</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">الثلاثاء</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">الأربعاء</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">الخميس</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">الجمعة</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">السبت</div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 justify-items-center">
              {renderCalendar()}
            </div>
            
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center space-x-4 space-x-reverse">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-light-accent dark:bg-dark-accent mr-2"></div>
                  <span className="text-sm">اليوم</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full border border-light-accent dark:border-dark-accent mr-2"></div>
                  <span className="text-sm">مناسبة إسلامية</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Date Details Section */}
          <div>
            {selectedDate ? (
              <div className="card">
                <div className="mb-6">
                  <h2 className="text-xl font-medium mb-1">
                    {formatGregorianDate(selectedDate)}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {formatHijriDate(selectedDate)}
                  </p>
                </div>
                
                {selectedEvents.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <CalendarIcon size={18} className="ml-2 text-light-accent dark:text-dark-accent" />
                      المناسبات الإسلامية
                    </h3>
                    
                    <div className="space-y-4">
                      {selectedEvents.map((event, index) => (
                        <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                          <h4 className="font-medium text-light-accent dark:text-dark-accent mb-2">
                            {event.name}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {event.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    لا توجد مناسبات إسلامية في هذا اليوم
                  </p>
                )}
              </div>
            ) : (
              <div className="card flex flex-col items-center justify-center min-h-[300px]">
                <CalendarIcon size={48} className="text-gray-300 dark:text-gray-700 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  اختر يوماً من التقويم لعرض التفاصيل
                </p>
              </div>
            )}
            
            {/* Islamic Events List */}
            <div className="card mt-6">
              <h3 className="text-lg font-medium mb-4">المناسبات الإسلامية القادمة</h3>
              
              <div className="space-y-3">
                {events.slice(0, 5).map((event, index) => {
                  // In a real app, we would calculate the actual date for each event
                  // based on the current Hijri year
                  return (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <span className="font-medium">{event.name}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {event.type === 'hijri' ? 
                          `${event.date.split('-')[0]}/${event.date.split('-')[1]} هـ` : 
                          `${event.date.split('-')[0]}/${event.date.split('-')[1]} م`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CalendarPage;
