import { useState } from 'react';
import { reciters } from '../../data/azkar/reciters';

export default function QuranAudioPlayer() {
  const [selectedReciter, setSelectedReciter] = useState(reciters[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-emerald-800 dark:text-emerald-200">
          القرآن الكريم
        </h1>
        
        <div className="bg-white dark:bg-emerald-900 rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-emerald-700 dark:text-emerald-300">
            اختر القارئ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reciters.map((reciter) => (
              <button
                key={reciter.id}
                onClick={() => setSelectedReciter(reciter)}
                className={`p-4 rounded-xl text-right transition-all duration-300 ${
                  selectedReciter.id === reciter.id
                    ? 'bg-emerald-100 dark:bg-emerald-800 border-2 border-emerald-500'
                    : 'bg-gray-50 dark:bg-emerald-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-800'
                }`}
              >
                <div className="font-medium text-emerald-800 dark:text-emerald-200">
                  {reciter.name}
                </div>
                <div className="text-sm text-emerald-600 dark:text-emerald-400">
                  {reciter.nameEn}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-emerald-900 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-emerald-700 dark:text-emerald-300">
            {selectedReciter.name}
          </h2>
          <div className="aspect-video w-full rounded-xl overflow-hidden">
            <iframe
              src={selectedReciter.url}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
} 