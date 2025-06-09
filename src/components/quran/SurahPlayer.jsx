import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Play, Pause, Download, Repeat, MoreVertical } from 'lucide-react';

export default function SurahPlayer({
  surahName,
  reciterName,
  reciterImg,
  audioSrc,
  onPrev,
  onNext
}) {
  const audioRef = useRef(new Audio(audioSrc));
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    audio.src = audioSrc;
    audio.addEventListener('timeupdate', () => setCurrent(audio.currentTime));
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
    audio.addEventListener('ended', () => setPlaying(false));
    return () => audio.pause();
  }, [audioSrc]);

  const togglePlay = () => {
    const audio = audioRef.current;
    playing ? audio.pause() : audio.play();
    setPlaying(!playing);
  };

  return (
    <div className="bg-blue-900 text-white p-6 rounded-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <button onClick={onNext} className="flex items-center space-x-1">
          <ArrowLeft /> <span>السورة التالية</span>
        </button>
        <h2 className="text-xl font-bold">سورة {surahName}</h2>
        <div className="flex items-center space-x-4">
          <button onClick={onPrev} className="flex items-center space-x-1">
            <span>السورة السابقة</span><ArrowRight />
          </button>
          <MoreVertical />
        </div>
      </div>

      <div className="flex flex-col items-center mb-4">
        <img
          src={reciterImg}
          alt={reciterName}
          className="w-24 h-24 rounded-full border-4 border-white mb-2 object-cover"
        />
        <h3 className="font-semibold">{reciterName}</h3>
        <p className="text-gray-200">سورة {surahName}</p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-start mb-2">
          <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
            <Download />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="monospace">{new Date(current * 1000).toISOString().substr(14, 5)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={current}
            onChange={e => {
              const t = Number(e.target.value);
              audioRef.current.currentTime = t;
              setCurrent(t);
            }}
            className="w-full"
          />
          <span className="monospace">{new Date(duration * 1000).toISOString().substr(14, 5)}</span>
        </div>

        <div className="flex justify-center items-center space-x-6 mt-2">
          <button onClick={togglePlay} className="p-4 bg-yellow-500 text-blue-900 rounded-full hover:bg-yellow-400">
            {playing ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button className="p-3 bg-gray-800 rounded-full hover:bg-gray-700">
            <Repeat />
          </button>
          <button className="p-3 bg-gray-800 rounded-full hover:bg-gray-700">
            <MoreVertical />
          </button>
        </div>
      </div>
    </div>
  );
}
