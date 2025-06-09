import { useState } from 'react';
import { ChevronUp, ChevronDown, Copy, Share2, MoreVertical } from 'lucide-react';
import { formatNumber } from '../../lib/utils';

export default function AyahViewer({ ayahs, onPrevAyah, onNextAyah }) {
  const [fontSize, setFontSize] = useState(24);

  return (
    <div className="bg-black text-white p-6 rounded-lg mt-6 relative font-arabic">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <button onClick={() => setFontSize(fs => Math.max(18, fs - 2))} className="p-2 bg-gray-800 rounded hover:bg-gray-700">-</button>
          <span>حجم الخط</span>
          <button onClick={() => setFontSize(fs => Math.min(36, fs + 2))} className="p-2 bg-gray-800 rounded hover:bg-gray-700">+</button>
        </div>
        <MoreVertical />
      </div>

      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
        <button onClick={onPrevAyah} className="p-2 bg-gray-800 rounded hover:bg-gray-700"><ChevronUp /></button>
        <button onClick={onNextAyah} className="p-2 bg-gray-800 rounded hover:bg-gray-700"><ChevronDown /></button>
      </div>

      <p className="text-yellow-400 text-center text-2xl mb-4">بسم الله الرحمن الرحيم</p>

      <div style={{ fontSize: `${fontSize}px` }}>
        {ayahs.map(ayah => (
          <div key={ayah.numberInSurah} className="mb-4 group relative">
            <span className="inline quran-text">{ayah.text}</span>
            <span className="text-blue-300 mx-1">({formatNumber(ayah.numberInSurah)})</span>
            <div className="absolute left-0 top-0 opacity-0 group-hover:opacity-100 transition p-1 bg-gray-900 rounded">
              <button className="px-1" onClick={() => navigator.clipboard.writeText(ayah.text)}><Copy size={16} /></button>
              <button className="px-1" onClick={() => navigator.clipboard.writeText(window.location.href)}><Share2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

