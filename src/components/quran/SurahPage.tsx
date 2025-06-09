import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Volume2, Copy, Share2, ChevronUp, Play, Pause, Repeat, SkipForward, SkipBack, Download, ListMusic, Shuffle } from 'lucide-react'; // Added Repeat, SkipForward, SkipBack, Download, ListMusic, Shuffle, ArrowLeft
import { motion } from 'framer-motion';
import { cn, formatNumber, copyToClipboard, generateShareLink, formatTime } from '../../lib/utils'; // Added formatTime
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';

// Import reciter images (adjust paths as needed)
import raadAlkurdyImg from '../../assets/reciters/raad_alkurdy.jpeg';
// Add imports for other reciter images here if available, otherwise use a default
// import defaultReciterImg from '../../assets/reciters/default.png';

interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
}

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
}

interface Reciter {
  id: string;
  name: string;
  audioUrl: string;
  image: string; // Added image field
  type: 'api' | 'direct';
  surahPrefix?: string;
  ayahPrefix?: string;
  fileExtension?: string;
}

// TODO: Add actual image paths for other reciters or use a default
const reciters: Reciter[] = [
  { 
    id: 'kurdi',
    name: 'رعد محمد الكردي',
    audioUrl: 'https://server6.mp3quran.net/kurdi/',
    image: raadAlkurdyImg, // Use imported image
    type: 'direct',
    fileExtension: '.mp3'
  },
  {
    id: 'Albanna_mojawwad',
    name: 'محمود علي البنا (مجود)',
    audioUrl: 'https://server8.mp3quran.net/bna/Almusshaf-Al-Mojawwad/',
    image: 'https://watanimg.elwatannews.com/image_archive/original_lower_quality/5551145621689862618.jpg',
    type: 'direct',
    fileExtension: '.mp3'
  },
  {
    id: 'Al-Dosari',
    name: 'ياسر الدوسري',
    audioUrl: 'https://server11.mp3quran.net/yasser',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRug-KW7tlny6-ViMy01Ql1Ujxrjb4L83dYZw&s',
    type: 'direct',
    fileExtension: '.mp3'
  },
  {
    id: 'Bader Alturki',
    name: 'بدر التركي',
    audioUrl: 'https://server10.mp3quran.net/bader/Rewayat-Hafs-A-n-Assem/',
    image: 'https://api2.quran-pro.com/images/badr-bin-mohammed-al-turki/badr-bin-mohammed-al-turki-medium.webp?version=1686737768846',
    type: 'direct',
    fileExtension: '.mp3'
  },
  {
    id: 'alafasy',
    name: 'مشاري راشد العفاسي',
    audioUrl: 'https://server8.mp3quran.net/afs/',
    image: 'https://upload.wikimedia.org/wikipedia/commons/2/24/%D0%9C%D0%B8%D1%88%D0%B0%D1%80%D0%B8_%D0%A0%D0%B0%D1%88%D0%B8%D0%B4.jpg',
    type: 'direct',
    fileExtension: '.mp3'
  },
  {
    id: 'minshawi_mojawwad',
    name: 'محمد صديق المنشاوي (مجود)',
    audioUrl: 'https://server10.mp3quran.net/minsh/Almusshaf-Al-Mojawwad/',
    image: 'https://i1.sndcdn.com/artworks-hyUqzJhQW7zyqkI0-k03iDg-t500x500.jpg',
    type: 'direct',
    fileExtension: '.mp3'
  },
  {
    id: 'minshawi_murattal',
    name: 'محمد صديق المنشاوي (مرتل)',
    audioUrl: 'https://server10.mp3quran.net/minsh/',
    image: 'https://i1.sndcdn.com/artworks-hyUqzJhQW7zyqkI0-k03iDg-t500x500.jpg',
    type: 'direct',
    fileExtension: '.mp3'
  },
  { 
    id: 'sudais',
    name: 'عبد الرحمن السديس',
    audioUrl: 'https://server11.mp3quran.net/sds/',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-TLkWE5HaOn8kwTNLqtrIaW_HYrALwiBtgA&s', // Placeholder
    type: 'direct',
    fileExtension: '.mp3'
  },
  { 
    id: 'shuraim',
    name: 'سعود الشريم',
    audioUrl: 'https://server7.mp3quran.net/shur/',
    image: 'https://i.scdn.co/image/ab67656300005f1fb628942c782729e0966886ca', // Placeholder
    type: 'direct',
    fileExtension: '.mp3'
  },
  { 
    id: 'maher',
    name: 'ماهر المعيقلي',
    audioUrl: 'https://server12.mp3quran.net/maher/',
    image: 'https://ghrannews.com/wp-content/uploads/2024/05/%D9%85%D8%A7%D9%87%D8%B1-%D8%A7%D9%84%D9%85%D8%B9%D9%8A%D9%82%D9%84%D9%8A.jpeg', // Placeholder
    type: 'direct',
    fileExtension: '.mp3'
  },
  { 
    id: 'abdulbasit',
    name: 'عبد الباسط عبد الصمد',
    audioUrl: 'https://server7.mp3quran.net/basit/',
    image: 'https://mediaaws.almasryalyoum.com/news/verylarge/2021/05/06/1529648_0.jpeg', // Placeholder
    type: 'direct',
    fileExtension: '.mp3'
  },
  { 
    id: 'husary_mojawwad',
    name: 'محمود خليل الحصري (مجود)',
    audioUrl: 'https://server13.mp3quran.net/husr/',
    image: 'https://watanimg.elwatannews.com/image_archive/original_lower_quality/18194265071637693809.jpg', // Placeholder
    type: 'direct',
    fileExtension: '.mp3'
  },
  { 
    id: 'ghamdi',
    name: 'سعد الغامدي',
    audioUrl: 'https://server7.mp3quran.net/s_gmd/',
    image: 'https://i1.sndcdn.com/artworks-9JG9m2FfFw6zeMuI-X1JjDA-t500x500.jpg', // Placeholder
    type: 'direct',
    fileExtension: '.mp3'
  },
  // Add other reciters from the original list if needed
];

const SurahPage = () => {
  const { surahNumber } = useParams<{ surahNumber: string }>();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [surah, setSurah] = useState<Surah | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReciterId, setSelectedReciterId] = useState<string>('kurdi');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isRepeating, setIsRepeating] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [fontSize, setFontSize] = useState<number>(24);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [surahAudioAvailable, setSurahAudioAvailable] = useState(true);
  const [selectedAyah, setSelectedAyah] = useState<number | null>(null);

  const currentReciter = reciters.find(r => r.id === selectedReciterId);
  const currentSurahNumber = parseInt(surahNumber || '1');

  useEffect(() => {
    // Reset state when surahNumber changes
    setSurah(null);
    setLoading(true);
    setError(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setAudioError(null);
    setAudioLoading(false);
    setSurahAudioAvailable(true);
    setSelectedAyah(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    const fetchSurah = async () => {
      if (!surahNumber) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.asad`);
        const data = await response.json();
        
        if (data.code === 200 && data.status === 'OK') {
          setSurah(data.data);
        } else {
          throw new Error('فشل في تحميل بيانات السورة');
        }
      } catch (err) {
        setError('حدث خطأ أثناء تحميل بيانات السورة. يرجى المحاولة مرة أخرى.');
        console.error('Error fetching surah:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSurah();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [surahNumber]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset audio state when reciter changes
  useEffect(() => {
    setSurahAudioAvailable(true);
    setAudioError(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setAudioLoading(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      // Don't nullify here, just update src if needed, or let playSurah handle creation
    }
    // Automatically try to load new audio if it was playing?
    // Consider UX: maybe wait for user to press play again.
  }, [selectedReciterId]);

  // Audio Event Listeners Setup
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (isRepeating) {
        audio.currentTime = 0;
        audio.play();
      } else {
        setIsPlaying(false);
        // Optionally play next surah automatically?
        // handleNextSurah(); 
      }
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setAudioLoading(true);
    const handleCanPlay = () => setAudioLoading(false);
    const handleError = () => handleAudioError(audio);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    // Cleanup listeners
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [audioRef.current, isRepeating]); // Re-attach if audio element or isRepeating changes

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize);
  };

  const handleBackClick = () => {
    navigate('/quran');
  };

  const handleAudioError = (audio: HTMLAudioElement | null = null) => {
    let errorMessage = 'ملف الصوت غير متوفر حالياً لهذا القارئ أو السورة.';
    setSurahAudioAvailable(false);
    setAudioError(errorMessage);
    setAudioLoading(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    // Don't nullify audioRef here, user might retry
    
    // Remove error message after 5 seconds
    setTimeout(() => setAudioError(null), 5000);
  };

  const getAudioUrl = (reciterId: string, surahNum: number): string | null => {
    const reciter = reciters.find(r => r.id === reciterId);
    if (!reciter || !reciter.audioUrl || !reciter.fileExtension) {
      console.error('Reciter or audio info not found for ID:', reciterId);
      return null;
    }
    
    // Format surah number with leading zeros
    const formattedSurahNumber = surahNum.toString().padStart(3, '0');
    
    // Handle different reciter URL formats
    if (reciterId === 'Albanna_mojawwad') {
      return `${reciter.audioUrl}${formattedSurahNumber}${reciter.fileExtension}`;
    } else if (reciterId === 'Albanna_murattal') {
      return `${reciter.audioUrl}${formattedSurahNumber}${reciter.fileExtension}`;
    } else if (reciterId === 'minshawi_mojawwad') {
      return `${reciter.audioUrl}${formattedSurahNumber}${reciter.fileExtension}`;
    } else if (reciterId === 'minshawi_murattal') {
      return `${reciter.audioUrl}${formattedSurahNumber}${reciter.fileExtension}`;
    } else {
      return `${reciter.audioUrl}${formattedSurahNumber}${reciter.fileExtension}`;
    }
  };

  const createAndLoadAudio = (surahNum: number): boolean => {
    const audioSrc = getAudioUrl(selectedReciterId, surahNum);
    if (!audioSrc) {
      handleAudioError();
      return false;
    }

    try {
      if (!audioRef.current || audioRef.current.src !== audioSrc) {
        // Pause and cleanup old audio if exists
        if (audioRef.current) {
          audioRef.current.pause();
        }
        // Create new audio element
        const newAudio = new Audio(audioSrc);
        newAudio.preload = 'metadata'; // Load metadata initially
        newAudio.volume = volume;
        audioRef.current = newAudio;
        setAudioLoading(true); // Indicate loading start
        setSurahAudioAvailable(true); // Assume available until error
        setAudioError(null);
      } else {
        // Audio element exists and src is the same, ensure it's ready
        setAudioLoading(false); 
      }
      return true;
    } catch (error) {
      console.error('Error creating or loading audio element:', error);
      handleAudioError();
      return false;
    }
  };

  const playSurah = async () => {
    if (!surah) return;

    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      if (!audioRef.current || audioRef.current.src !== getAudioUrl(selectedReciterId, surah.number)) {
        // If audio not loaded or source is different, load it first
        const loaded = createAndLoadAudio(surah.number);
        if (loaded && audioRef.current) {
          try {
            await audioRef.current.play();
          } catch (err) {
            console.error("Error playing audio: ", err);
            handleAudioError(audioRef.current);
          }
        }
      } else {
        // Audio is loaded and source is correct, just play
        try {
          await audioRef.current?.play();
        } catch (err) {
          console.error("Error playing audio: ", err);
          handleAudioError(audioRef.current);
        }
      }
    }
  };

  const handleReciterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedReciterId(event.target.value);
    // Audio state reset is handled by the useEffect hook watching selectedReciterId
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = parseFloat(event.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleRepeat = () => {
    setIsRepeating(!isRepeating);
  };

  const handleDownload = () => {
    if (!surah) return;
    const url = getAudioUrl(selectedReciterId, surah.number);
    if (url) {
      // Create a temporary link element and click it to trigger download
      const link = document.createElement('a');
      link.href = url;
      // Suggest a filename (optional)
      link.download = `Surah_${surah.number}_${currentReciter?.name || selectedReciterId}.mp3`; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('رابط التحميل غير متوفر.');
    }
  };

  const handlePreviousSurah = () => {
    if (currentSurahNumber > 1) {
      navigate(`/quran/${currentSurahNumber - 1}`);
    }
  };

  const handleNextSurah = () => {
    if (currentSurahNumber < 114) {
      navigate(`/quran/${currentSurahNumber + 1}`);
    }
  };

  // Ayah-specific actions (Copy, Share) - Keep as they are or integrate with main player?
  // For now, keep the hover actions for individual ayahs.
  const handleCopyAyah = async (ayah: Ayah) => {
    const textToCopy = `${ayah.text} [${surah?.name} ${formatNumber(ayah.numberInSurah)}]`;
    const success = await copyToClipboard(textToCopy);
    alert(success ? 'تم نسخ الآية بنجاح' : 'فشل في نسخ الآية');
  };

  const handleShareAyah = async (ayah: Ayah) => {
    const shareUrl = generateShareLink(`/quran/${surah?.number}?ayah=${ayah.numberInSurah}`);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${surah?.name} - الآية ${formatNumber(ayah.numberInSurah)}`,
          text: `${ayah.text} [${surah?.name} ${formatNumber(ayah.numberInSurah)}]`,
          url: shareUrl
        });
      } catch (err) {
        console.error('Error sharing:', err);
        const success = await copyToClipboard(shareUrl);
        if (success) alert('تم نسخ رابط الآية بنجاح');
      }
    } else {
      const success = await copyToClipboard(shareUrl);
      if (success) alert('تم نسخ رابط الآية بنجاح');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAyahClick = (ayahNumber: number) => {
    setSelectedAyah(ayahNumber);
    // Scroll to the selected ayah
    const ayahElement = document.getElementById(`ayah-${ayahNumber}`);
    if (ayahElement) {
      ayahElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // --- Render Logic ---

  if (loading && !surah) { // Show loading only if surah data is not yet available
    return (
      <div className="container-page min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) { // Show error if fetching failed
    return (
      <div className="container-page">
        <button 
          onClick={handleBackClick}
          className="flex items-center text-light-accent dark:text-dark-accent hover:underline mb-6"
        >
          <ArrowRight className="ml-1" size={18} />
          العودة لقائمة السور
        </button>
        <ErrorMessage 
          message={error} 
          retry={() => window.location.reload()}
        />
      </div>
    );
  }
  
  if (!surah) { // Handle case where loading finished but surah is still null (shouldn't happen ideally)
     return (
      <div className="container-page">
        <button 
          onClick={handleBackClick}
          className="flex items-center text-light-accent dark:text-dark-accent hover:underline mb-6"
        >
          <ArrowRight className="ml-1" size={18} />
          العودة لقائمة السور
        </button>
        <ErrorMessage message="لم يتم العثور على بيانات السورة." />
      </div>
    );
  }

  // --- Main Render --- 
  return (
    <div className="container-page text-white" dir="rtl"> {/* Ensure RTL direction and white text for dark theme */} 
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Top Surah Navigation (as per image) */}
        <div className="flex justify-between items-center mb-6 bg-gray-800 p-4 rounded-lg shadow-md">
          <button
            onClick={handlePreviousSurah}
            disabled={currentSurahNumber <= 1}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowRight size={20} /> {/* Arrow points right for Previous in RTL */} 
            <span>السورة السابقة</span>
             {/* Optionally display previous surah name */} 
          </button>
          <h1 className="text-2xl font-bold font-title">
            سورة {surah.name}
          </h1>
          <button
            onClick={handleNextSurah}
            disabled={currentSurahNumber >= 114}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span>السورة التالية</span>
            <ArrowLeft size={20} /> {/* Arrow points left for Next in RTL */} 
             {/* Optionally display next surah name */} 
          </button>
        </div>

        {/* Main Player Section (as per image) */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 flex flex-col items-center relative">
          {/* Download Button (Top Left in Image) */}
          <button
            onClick={handleDownload}
            disabled={!surahAudioAvailable}
            className="absolute top-4 left-4 p-2 bg-gray-700 rounded-full hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="تحميل السورة"
          >
            <Download size={20} />
          </button>

          {/* Reciter Image */}
          <img 
            src={currentReciter?.image || ''} // Use placeholder if no image
            alt={currentReciter?.name || 'Reciter'}
            className="w-24 h-24 rounded-full object-cover border-4 border-gray-700 shadow-md mb-4"
            onError={(e) => { e.currentTarget.src = ''; /* Handle image load error, maybe show default */ }} 
          />

          {/* Reciter and Surah Name */}
          <h2 className="text-xl font-semibold mb-1">{currentReciter?.name || 'القارئ'}</h2>
          <p className="text-gray-400 mb-4">سورة {surah.name}</p>

          {/* Seek Bar */}
          <div className="w-full max-w-md mb-2">
            <input 
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              disabled={!surahAudioAvailable || audioLoading}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="شريط التقدم"
            />
          </div>

          {/* Time Display */}
          <div className="w-full max-w-md flex justify-between text-xs text-gray-400 mb-4 px-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Audio Controls (as per image, adjusted for request) */}
          <div className="flex items-center justify-center space-x-4 space-x-reverse w-full max-w-md">
            {/* Volume Control (Icon + Slider on hover/click?) - Simplified for now */}
            <div className="relative">
              <button 
                onClick={() => setShowVolumeControl(!showVolumeControl)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="الصوت"
              >
                <Volume2 size={20} />
              </button>
              {showVolumeControl && (
                <input 
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                  aria-label="مستوى الصوت"
                />
              )}
            </div>

            {/* Repeat Button */}
            <button
              onClick={toggleRepeat}
              className={`p-2 ${isRepeating ? 'text-yellow-500' : 'text-gray-400'} hover:text-white transition-colors`}
              aria-label="تكرار"
            >
              <Repeat size={20} />
            </button>

            {/* Previous Button (Placeholder - Image shows track skip, request implies Surah skip which is handled above) */}
            {/* <button 
              className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              aria-label="السابق"
              // onClick={handlePreviousTrack} // Add if needed
              disabled={true} 
            >
              <SkipBack size={24} />
            </button> */}

            {/* Play/Pause Button */}
            <button
              onClick={playSurah}
              disabled={!surahAudioAvailable || audioLoading}
              className="p-3 bg-gray-500 text-gray-900 rounded-full hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mx-2 shadow-lg"
              aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
            >
              {audioLoading ? (
                <LoadingSpinner size="sm" className="w-6 h-6" />
              ) : isPlaying ? (
                <Pause size={24} />
              ) : (
                <Play size={24} />
              )}
            </button>

            {/* Next Button (Placeholder - Image shows track skip) */}
            {/* <button 
              className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              aria-label="التالي"
              // onClick={handleNextTrack} // Add if needed
              disabled={true}
            >
              <SkipForward size={24} />
            </button> */}

            {/* Shuffle Button (Placeholder - From image, not requested) */}
            {/* <button 
              className="p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="عشوائي"
            >
              <Shuffle size={20} />
            </button> */}

            {/* Playlist Button (Placeholder - From image, not requested) */}
            {/* <button 
              className="p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="قائمة التشغيل"
            >
              <ListMusic size={20} />
            </button> */}
            
             {/* Reciter Select Dropdown */}
             <div className="flex items-center">
               <label htmlFor="reciter-select" className="ml-2 text-sm font-medium text-gray-400">
                 القارئ:
               </label>
               <select
                 id="reciter-select"
                 value={selectedReciterId}
                 onChange={handleReciterChange}
                 className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow-500 dark:focus:border-yellow-500 max-w-xs"
               >
                 {reciters.map((reciter) => (
                   <option key={reciter.id} value={reciter.id}>
                     {reciter.name}
                   </option>
                 ))}
               </select>
             </div>

          </div>

          {/* Audio Error Message */}
          {audioError && (
            <div className="bg-red-900/30 text-red-200 p-3 rounded-md text-sm mt-4 w-full max-w-md text-center">
              {audioError}
            </div>
          )}
          {!surahAudioAvailable && !audioError && (
             <div className="bg-yellow-900/30 text-yellow-200 p-3 rounded-md text-sm mt-4 w-full max-w-md text-center">
               ملف الصوت غير متوفر حالياً لهذا القارئ أو السورة.
             </div>
           )}
        </div>

        {/* Ayahs Section */}
        <div className="card bg-gray-800 p-6 rounded-lg shadow-lg">
          {/* Font Size Control */}
          <div className="flex justify-end items-center mb-4">
            <label htmlFor="font-size" className="ml-2 text-sm font-medium text-gray-400">
              حجم الخط:
            </label>
            <div className="flex items-center space-x-2 space-x-reverse">
              <button 
                onClick={() => handleFontSizeChange(Math.max(18, fontSize - 2))}
                className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white"
              >
                -
              </button>
              <span className="w-8 text-center text-white">{fontSize}</span>
              <button 
                onClick={() => handleFontSizeChange(Math.min(36, fontSize + 2))}
                className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white"
              >
                +
              </button>
            </div>
          </div>
            
          {/* Bismillah */}
          {surah.number !== 1 && surah.number !== 9 && (
            <p className="text-center quran-text text-2xl my-6 text-yellow-400 font-arabic">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          )}
          
          {/* Ayah Text */}
          <div className="flex flex-wrap gap-x-2 gap-y-4 text-justify leading-loose font-arabic" style={{ fontSize: `${fontSize}px` }}>
            {surah.ayahs.map((ayah) => (
              <div 
                key={ayah.number} 
                id={`ayah-${ayah.numberInSurah}`}
                className={cn(
                  "inline relative group text-white cursor-pointer",
                  selectedAyah === ayah.numberInSurah && "bg-yellow-900/30 rounded"
                )}
                onClick={() => handleAyahClick(ayah.numberInSurah)}
              >
                <span className="quran-text">{ayah.text}</span>
                {/* Ayah number circle */}
                <span className="inline-flex items-center justify-center w-7 h-7 text-xs mx-1 rounded-full bg-gray-700 text-yellow-400 font-sans">
                  {formatNumber(ayah.numberInSurah)}
                </span>
                
                {/* Ayah Actions (Hover) */}
                <div className="absolute -top-10 right-1/2 transform translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 space-x-reverse bg-gray-900 rounded-md shadow-lg p-1 border border-gray-700 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyAyah(ayah);
                    }}
                    className="p-1.5 rounded-full hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
                    aria-label="نسخ"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShareAyah(ayah);
                    }}
                    className="p-1.5 rounded-full hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
                    aria-label="مشاركة"
                  >
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 left-6 p-3 rounded-full bg-yellow-500 text-gray-900 shadow-lg hover:bg-yellow-400 transition-opacity z-50"
            aria-label="العودة للأعلى"
          >
            <ChevronUp size={24} />
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default SurahPage;

