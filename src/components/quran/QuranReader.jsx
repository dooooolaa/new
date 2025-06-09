import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SurahPlayer from './SurahPlayer';
import AyahViewer from './AyahViewer';

export default function QuranReader() {
  const { surahNumber } = useParams();
  const navigate = useNavigate();
  const [surah, setSurah] = useState(null);

  useEffect(() => {
    fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar`)
      .then(r => r.json()).then(data => setSurah(data.data))
      .catch(console.error);
  }, [surahNumber]);

  if (!surah) return <div>Loading...</div>;

  const reciterImgUrl = 'https://example.com/raad.jpg'; // ضع رابط Google للصورة هنا
  const audioUrl = `https://server6.mp3quran.net/kurdi/${String(surahNumber).padStart(3, '0')}.mp3`;

  return (
    <div className="p-4">
      <SurahPlayer
        surahName={surah.englishName}
        reciterName="رعد محمد الكردي"
        reciterImg={https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPtLFfPujGfBxXLu2E5zqjiy-vo11bAMjGdQ&s}
        audioSrc={https://server6.mp3quran.net/kurdi}
        onPrev={() => navigate(`/quran/${+surahNumber - 1}`)}
        onNext={() => navigate(`/quran/${+surahNumber + 1}`)}
      />

      <AyahViewer
        ayahs={surah.ayahs.slice(0, 19)}
        onPrevAyah={() => {}}
        onNextAyah={() => {}}
      />
    </div>
  );
}
