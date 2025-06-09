import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Heart, Book, Star, Home, Plane, Utensils } from 'lucide-react';

const duasData = {
  daily: [
    {
      id: 1,
      title: "دعاء الاستيقاظ من النوم",
      text: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
      translation: "الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور",
      category: "daily"
    },
    {
      id: 2,
      title: "دعاء دخول الخلاء",
      text: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
      translation: "اللهم إني أعوذ بك من الخبث والخبائث",
      category: "daily"
    },
    {
      id: 3,
      title: "دعاء الخروج من الخلاء",
      text: "غُفْرَانَكَ",
      translation: "غفرانك",
      category: "daily"
    }
  ],
  food: [
    {
      id: 4,
      title: "دعاء قبل الطعام",
      text: "بِسْمِ اللَّهِ",
      translation: "بسم الله",
      category: "food"
    },
    {
      id: 5,
      title: "دعاء بعد الطعام",
      text: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
      translation: "الحمد لله الذي أطعمنا وسقانا وجعلنا مسلمين",
      category: "food"
    }
  ],
  travel: [
    {
      id: 6,
      title: "دعاء السفر",
      text: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
      translation: "سبحان الذي سخر لنا هذا وما كنا له مقرنين وإنا إلى ربنا لمنقلبون",
      category: "travel"
    },
    {
      id: 7,
      title: "دعاء دخول القرية أو البلدة",
      text: "اللَّهُمَّ رَبَّ السَّمَوَاتِ السَّبْعِ وَمَا أَظْلَلْنَ",
      translation: "اللهم رب السموات السبع وما أظللن",
      category: "travel"
    }
  ],
  home: [
    {
      id: 8,
      title: "دعاء دخول المنزل",
      text: "بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا",
      translation: "بسم الله ولجنا وبسم الله خرجنا وعلى الله ربنا توكلنا",
      category: "home"
    },
    {
      id: 9,
      title: "دعاء الخروج من المنزل",
      text: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
      translation: "بسم الله توكلت على الله ولا حول ولا قوة إلا بالله",
      category: "home"
    }
  ],
  special: [
    {
      id: 10,
      title: "دعاء الاستخارة",
      text: "اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ",
      translation: "اللهم إني أستخيرك بعلمك وأستقدرك بقدرتك",
      category: "special"
    },
    {
      id: 11,
      title: "دعاء الكرب",
      text: "لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ",
      translation: "لا إله إلا الله العظيم الحليم",
      category: "special"
    }
  ]
};

const DuasPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('daily');
  const [favorites, setFavorites] = useState(new Set());

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const categories = [
    { key: 'daily', title: 'الأدعية اليومية', icon: Book },
    { key: 'food', title: 'أدعية الطعام', icon: Utensils },
    { key: 'travel', title: 'أدعية السفر', icon: Plane },
    { key: 'home', title: 'أدعية المنزل', icon: Home },
    { key: 'special', title: 'أدعية خاصة', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="title-text text-4xl font-bold text-gray-800 mb-4">
            الأدعية
          </h1>
          <p className="arabic-text text-xl text-gray-600">
            مجموعة من الأدعية المأثورة عن النبي صلى الله عليه وسلم
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

        {/* Duas List */}
        <div className="space-y-6">
          {duasData[selectedCategory]?.map((dua) => (
            <div key={dua.id} className="bg-white rounded-lg shadow-md p-6 border">
              <div className="flex justify-between items-start mb-4">
                <h3 className="title-text text-xl font-bold text-gray-800">
                  {dua.title}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorite(dua.id)}
                  className={`${favorites.has(dua.id) ? 'text-red-500' : 'text-gray-400'}`}
                >
                  <Heart 
                    size={20} 
                    fill={favorites.has(dua.id) ? 'currentColor' : 'none'}
                  />
                </Button>
              </div>
              
              <div className="text-center mb-4">
                <p className="quran-text text-2xl md:text-3xl leading-loose text-gray-800 mb-3">
                  {dua.text}
                </p>
                <p className="arabic-text text-lg text-gray-600">
                  {dua.translation}
                </p>
              </div>
              
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(dua.text)}
                  className="arabic-text"
                >
                  نسخ النص
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const utterance = new SpeechSynthesisUtterance(dua.text);
                    utterance.lang = 'ar';
                    speechSynthesis.speak(utterance);
                  }}
                  className="arabic-text"
                >
                  استماع
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Favorites Section */}
        {favorites.size > 0 && (
          <div className="mt-12">
            <h2 className="title-text text-2xl font-bold text-gray-800 mb-6 text-center">
              الأدعية المفضلة
            </h2>
            <div className="space-y-4">
              {Array.from(favorites).map(favId => {
                const dua = Object.values(duasData).flat().find(d => d.id === favId);
                return dua ? (
                  <div key={dua.id} className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h4 className="title-text font-bold text-gray-800 mb-2">
                      {dua.title}
                    </h4>
                    <p className="quran-text text-lg text-gray-700">
                      {dua.text}
                    </p>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DuasPage;

