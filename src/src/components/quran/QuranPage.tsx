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
              className="input pr-10"
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
          {filteredSurahs.map((surah) => (
            <Link
              key={surah.number}
              to={`/quran/${surah.number}`}
              className="card hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start">
                <div className={cn(
                  "flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full mb-2 ml-3",
                  "bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100"
                )}>
                  <span className="text-sm font-bold">{formatNumber(surah.number)}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{surah.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {surah.englishName} • {surah.englishNameTranslation}
                  </p>
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
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