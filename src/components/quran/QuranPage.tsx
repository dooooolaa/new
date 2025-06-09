import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn, formatNumber } from '../../lib/utils';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

const QuranPage = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await response.json();
        
        if (data.code === 200 && data.status === 'OK') {
          setSurahs(data.data);
          setFilteredSurahs(data.data);
        } else {
          throw new Error('فشل في تحميل بيانات السور');
        }
      } catch (err) {
        setError('حدث خطأ أثناء تحميل بيانات السور. يرجى المحاولة مرة أخرى.');
        console.error('Error fetching surahs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSurahs();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSurahs(surahs);
    } else {
      const filtered = surahs.filter(
        (surah) =>
          surah.name.includes(searchQuery) ||
          surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          surah.number.toString().includes(searchQuery)
      );
      setFilteredSurahs(filtered);
    }
  }, [searchQuery, surahs]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return (
      <div className="container-page min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-page">
        <h1 className="section-title">القرآن الكريم</h1>
        <ErrorMessage message={error} retry={() => window.location.reload()} />
      </div>
    );
  }

  // Define color classes for different surahs
  const getCardColorClass = (index: number) => {
    const colors = [
      'bg-green-50 border-green-200',
      'bg-red-50 border-red-200',
      'bg-blue-50 border-blue-200',
      'bg-purple-50 border-purple-200',
      'bg-orange-50 border-orange-200',
      'bg-pink-50 border-pink-200',
      'bg-teal-50 border-teal-200',
      'bg-indigo-50 border-indigo-200'
    ];
    return colors[index % colors.length];
  };

  const getNumberColorClass = (index: number) => {
    const colors = [
      'bg-green-100 text-green-800',
      'bg-red-100 text-red-800',
      'bg-blue-100 text-blue-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800',
      'bg-pink-100 text-pink-800',
      'bg-teal-100 text-teal-800',
      'bg-indigo-100 text-indigo-800'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="container-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="section-title">القرآن الكريم</h1>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث عن سورة..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-3 pr-10 border-2 border-green-200 rounded-lg focus:outline-none focus:border-green-500 text-right"
              style={{ fontFamily: '"Noto Sans Arabic", sans-serif' }}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {/* Surahs Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {filteredSurahs.map((surah, index) => (
            <Link
              key={surah.number}
              to={`/quran/${surah.number}`}
              className={cn(
                "block p-6 rounded-lg border-2 transition-all duration-300 hover:shadow-lg",
                getCardColorClass(index)
              )}
              style={{ 
                width: '236px', 
                height: '148px',
                fontFamily: '"Noto Sans Arabic", sans-serif'
              }}
            >
              <div className="flex items-start">
                <div className={cn(
                  "flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full mb-2 ml-3 text-sm font-bold",
                  getNumberColorClass(index)
                )}>
                  <span>{formatNumber(surah.number)}</span>
                </div>
                <div>
                  <h3 
                    className="text-xl font-bold mb-1 text-gray-800"
                    style={{ 
                      fontFamily: 'Amiri, serif',
                      fontSize: '20px',
                      lineHeight: '28px'
                    }}
                  >
                    {surah.name}
                  </h3>
                  <p 
                    className="text-sm text-gray-600 mb-2"
                    style={{ 
                      fontFamily: '"Noto Sans Arabic", sans-serif',
                      fontSize: '14px',
                      lineHeight: '20px'
                    }}
                  >
                    {surah.englishName} • {surah.englishNameTranslation}
                  </p>
                  <div 
                    className="flex text-sm text-gray-600"
                    style={{ 
                      fontFamily: '"Noto Sans Arabic", sans-serif',
                      fontSize: '14px'
                    }}
                  >
                    <span>{formatNumber(surah.numberOfAyahs)} آية</span>
                    <span className="mx-2">•</span>
                    <span>{surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {filteredSurahs.length === 0 && (
            <div className="col-span-full text-center py-10">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                لا توجد نتائج للبحث عن "{searchQuery}"
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default QuranPage;

