import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Heart, Sun, Moon, Clock } from 'lucide-react';

const azkarData = {
  morning: [
    {
      id: 1,
      text: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
      translation: "أعوذ بالله من الشيطان الرجيم",
      count: 1
    },
    {
      id: 2,
      text: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
      translation: "بسم الله الرحمن الرحيم",
      count: 1
    },
    {
      id: 3,
      text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
      translation: "أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له",
      count: 1
    },
    {
      id: 4,
      text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
      translation: "سبحان الله وبحمده",
      count: 100
    },
    {
      id: 5,
      text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
      translation: "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير",
      count: 10
    },
    {
      id: 6,
      text: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
      translation: "أستغفر الله وأتوب إليه",
      count: 100
    }
  ],
  evening: [
    {
      id: 7,
      text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
      translation: "أعوذ بكلمات الله التامات من شر ما خلق",
      count: 3
    },
    {
      id: 8,
      text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
      translation: "أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له",
      count: 1
    },
    {
      id: 9,
      text: "سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ",
      translation: "سبحان الله والحمد لله",
      count: 33
    },
    {
      id: 10,
      text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
      translation: "اللهم بك أمسينا، وبك أصبحنا، وبك نحيا، وبك نموت، وإليك النشور",
      count: 1
    }
  ],
  afterPrayer: [
    {
      id: 11,
      text: "سُبْحَانَ اللَّهِ",
      translation: "سبحان الله",
      count: 33
    },
    {
      id: 12,
      text: "الْحَمْدُ لِلَّهِ",
      translation: "الحمد لله",
      count: 33
    },
    {
      id: 13,
      text: "اللَّهُ أَكْبَرُ",
      translation: "الله أكبر",
      count: 34
    },
    {
      id: 14,
      text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
      translation: "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير",
      count: 1
    }
  ]
};

const AzkarPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('morning');
  const [counters, setCounters] = useState({});

  useEffect(() => {
    // Initialize counters for all azkar
    const initialCounters = {};
    Object.values(azkarData).flat().forEach(zikr => {
      initialCounters[zikr.id] = 0;
    });
    setCounters(initialCounters);
  }, []);

  const incrementCounter = (id, maxCount) => {
    setCounters(prev => ({
      ...prev,
      [id]: prev[id] < maxCount ? prev[id] + 1 : 0
    }));
  };

  const resetCounter = (id) => {
    setCounters(prev => ({
      ...prev,
      [id]: 0
    }));
  };

  const categories = [
    { key: 'morning', title: 'أذكار الصباح', icon: Sun },
    { key: 'evening', title: 'أذكار المساء', icon: Moon },
    { key: 'afterPrayer', title: 'أذكار بعد الصلاة', icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="title-text text-4xl font-bold text-gray-800 mb-4">
            الأذكار
          </h1>
          <p className="arabic-text text-xl text-gray-600">
            أذكار الصباح والمساء وأذكار بعد الصلاة
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map(category => {
            const IconComponent = category.icon;
            return (
              <Button
                key={category.key}
                variant={selectedCategory === category.key ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.key)}
                className="arabic-text flex items-center gap-2"
              >
                <IconComponent size={20} />
                {category.title}
              </Button>
            );
          })}
        </div>

        {/* Azkar List */}
        <div className="space-y-6">
          {azkarData[selectedCategory]?.map((zikr) => (
            <div key={zikr.id} className="bg-white rounded-lg shadow-md p-6 border">
              <div className="text-center mb-4">
                <p className="quran-text text-2xl md:text-3xl leading-loose text-gray-800 mb-3">
                  {zikr.text}
                </p>
                <p className="arabic-text text-lg text-gray-600">
                  {zikr.translation}
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => resetCounter(zikr.id)}
                  className="arabic-text"
                >
                  إعادة تعيين
                </Button>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {counters[zikr.id] || 0} / {zikr.count}
                  </div>
                  <Button
                    onClick={() => incrementCounter(zikr.id, zikr.count)}
                    className="arabic-text"
                    disabled={counters[zikr.id] >= zikr.count}
                  >
                    <Heart className="ml-2" size={16} />
                    {counters[zikr.id] >= zikr.count ? 'مكتمل' : 'تسبيح'}
                  </Button>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((counters[zikr.id] || 0) / zikr.count) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AzkarPage;

