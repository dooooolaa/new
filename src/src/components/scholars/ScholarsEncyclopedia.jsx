import { useState } from 'react'

const scholarsData = {
  companions: [
    {
      id: 1,
      name: 'أبو بكر الصديق',
      nameEn: 'Abu Bakr As-Siddiq',
      title: 'الخليفة الأول',
      period: '573-634 م / 51 ق.هـ - 13 هـ',
      description: 'أول الخلفاء الراشدين وأول من آمن من الرجال، صاحب رسول الله في الغار',
      achievements: [
        'أول من آمن من الرجال',
        'صاحب النبي في الهجرة',
        'جمع القرآن الكريم',
        'حارب المرتدين'
      ],
      books: ['خطب أبي بكر الصديق'],
      category: 'companions'
    },
    {
      id: 2,
      name: 'عمر بن الخطاب',
      nameEn: 'Umar ibn Al-Khattab',
      title: 'الفاروق - الخليفة الثاني',
      period: '584-644 م / 40 ق.هـ - 23 هـ',
      description: 'ثاني الخلفاء الراشدين، الفاروق الذي فرق الله به بين الحق والباطل',
      achievements: [
        'وضع التقويم الهجري',
        'أنشأ نظام الدواوين',
        'فتح بيت المقدس',
        'عُرف بعدله وقوته'
      ],
      books: ['رسائل عمر بن الخطاب'],
      category: 'companions'
    },
    {
      id: 3,
      name: 'عثمان بن عفان',
      nameEn: 'Uthman ibn Affan',
      title: 'ذو النورين - الخليفة الثالث',
      period: '576-656 م / 47 ق.هـ - 35 هـ',
      description: 'ثالث الخلفاء الراشدين، لُقب بذي النورين لزواجه من ابنتي النبي',
      achievements: [
        'جمع القرآن في مصحف واحد',
        'توسيع المسجد الحرام',
        'توسيع المسجد النبوي',
        'تزوج رقية وأم كلثوم بنتي النبي'
      ],
      books: ['مصحف عثمان'],
      category: 'companions'
    },
    {
      id: 4,
      name: 'علي بن أبي طالب',
      nameEn: 'Ali ibn Abi Talib',
      title: 'أمير المؤمنين - الخليفة الرابع',
      period: '599-661 م / 23 ق.هـ - 40 هـ',
      description: 'رابع الخلفاء الراشدين، ابن عم النبي وزوج فاطمة الزهراء',
      achievements: [
        'أول من أسلم من الصبيان',
        'فارس الإسلام وبطله',
        'خطيب مفوه وشاعر',
        'عُرف بالحكمة والعدل'
      ],
      books: ['نهج البلاغة', 'خطب الإمام علي'],
      category: 'companions'
    }
  ],
  imams: [
    {
      id: 5,
      name: 'الإمام أبو حنيفة',
      nameEn: 'Imam Abu Hanifa',
      title: 'الإمام الأعظم',
      period: '699-767 م / 80-150 هـ',
      description: 'إمام المذهب الحنفي، أول الأئمة الأربعة، عُرف بالرأي والقياس',
      achievements: [
        'مؤسس المذهب الحنفي',
        'أول من دون الفقه',
        'عُرف بالورع والتقوى',
        'رفض منصب القضاء'
      ],
      books: ['المسند', 'الفقه الأكبر'],
      category: 'imams'
    },
    {
      id: 6,
      name: 'الإمام مالك',
      nameEn: 'Imam Malik',
      title: 'إمام دار الهجرة',
      period: '711-795 م / 93-179 هـ',
      description: 'إمام المذهب المالكي، إمام أهل المدينة، صاحب الموطأ',
      achievements: [
        'مؤسس المذهب المالكي',
        'صاحب كتاب الموطأ',
        'إمام أهل المدينة',
        'عُرف بالحفظ والإتقان'
      ],
      books: ['الموطأ'],
      category: 'imams'
    },
    {
      id: 7,
      name: 'الإمام الشافعي',
      nameEn: 'Imam Ash-Shafi\'i',
      title: 'ناصر السنة',
      period: '767-820 م / 150-204 هـ',
      description: 'إمام المذهب الشافعي، واضع علم أصول الفقه، عُرف بالذكاء والفصاحة',
      achievements: [
        'مؤسس المذهب الشافعي',
        'واضع علم أصول الفقه',
        'صاحب كتاب الرسالة',
        'عُرف بالشعر والأدب'
      ],
      books: ['الرسالة', 'الأم', 'ديوان الشافعي'],
      category: 'imams'
    },
    {
      id: 8,
      name: 'الإمام أحمد بن حنبل',
      nameEn: 'Imam Ahmad ibn Hanbal',
      title: 'إمام أهل السنة',
      period: '780-855 م / 164-241 هـ',
      description: 'إمام المذهب الحنبلي، إمام أهل السنة والجماعة، صاحب المسند',
      achievements: [
        'مؤسس المذهب الحنبلي',
        'صاحب المسند الكبير',
        'ثبت في محنة خلق القرآن',
        'إمام في الحديث والفقه'
      ],
      books: ['المسند', 'العقيدة'],
      category: 'imams'
    }
  ],
  scholars: [
    {
      id: 9,
      name: 'ابن تيمية',
      nameEn: 'Ibn Taymiyyah',
      title: 'شيخ الإسلام',
      period: '1263-1328 م / 661-728 هـ',
      description: 'شيخ الإسلام، مجدد القرن السابع، عُرف بالجهاد بالقلم واللسان',
      achievements: [
        'مجدد الدين في عصره',
        'محارب البدع والخرافات',
        'مؤلف غزير الإنتاج',
        'مجاهد بالقلم واللسان'
      ],
      books: ['مجموع الفتاوى', 'منهاج السنة النبوية', 'العقيدة الواسطية'],
      category: 'scholars'
    },
    {
      id: 10,
      name: 'ابن القيم',
      nameEn: 'Ibn Al-Qayyim',
      title: 'ابن قيم الجوزية',
      period: '1292-1350 م / 691-751 هـ',
      description: 'تلميذ ابن تيمية، عُرف بالتأليف في التربية والسلوك والفقه',
      achievements: [
        'تلميذ شيخ الإسلام ابن تيمية',
        'مؤلف في التربية والسلوك',
        'عُرف بالتحقيق والتدقيق',
        'جمع بين العلم والعمل'
      ],
      books: ['إعلام الموقعين', 'مدارج السالكين', 'زاد المعاد'],
      category: 'scholars'
    },
    {
      id: 11,
      name: 'الإمام النووي',
      nameEn: 'Imam An-Nawawi',
      title: 'محيي الدين النووي',
      period: '1233-1277 م / 631-676 هـ',
      description: 'الإمام المحدث الفقيه، صاحب الأربعين النووية ورياض الصالحين',
      achievements: [
        'صاحب الأربعين النووية',
        'مؤلف رياض الصالحين',
        'شارح صحيح مسلم',
        'عُرف بالورع والزهد'
      ],
      books: ['الأربعون النووية', 'رياض الصالحين', 'شرح صحيح مسلم'],
      category: 'scholars'
    },
    {
      id: 12,
      name: 'الإمام الغزالي',
      nameEn: 'Imam Al-Ghazali',
      title: 'حجة الإسلام',
      period: '1058-1111 م / 450-505 هـ',
      description: 'حجة الإسلام، الفيلسوف والفقيه والصوفي، صاحب إحياء علوم الدين',
      achievements: [
        'صاحب إحياء علوم الدين',
        'جمع بين الفقه والتصوف',
        'فيلسوف ومتكلم',
        'مجدد القرن الخامس'
      ],
      books: ['إحياء علوم الدين', 'المستصفى', 'تهافت الفلاسفة'],
      category: 'scholars'
    }
  ]
}

export default function ScholarsEncyclopedia() {
  const [selectedCategory, setSelectedCategory] = useState('companions')
  const [selectedScholar, setSelectedScholar] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const categories = {
    companions: { name: 'الصحابة', icon: '👥', description: 'أصحاب رسول الله صلى الله عليه وسلم' },
    imams: { name: 'الأئمة الأربعة', icon: '📚', description: 'أئمة المذاهب الفقهية الأربعة' },
    scholars: { name: 'العلماء', icon: '🎓', description: 'علماء الإسلام عبر التاريخ' }
  }

  const getCurrentScholars = () => {
    return scholarsData[selectedCategory] || []
  }

  const filteredScholars = getCurrentScholars().filter(scholar =>
    scholar.name.includes(searchTerm) || 
    scholar.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scholar.title.includes(searchTerm)
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            موسوعة العلماء
          </h1>
          <p className="text-xl text-gray-300">
            تراجم وسير كبار علماء الإسلام من الصحابة والأئمة والعلماء
          </p>
        </div>

        {/* Category Selection */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedCategory(key)
                  setSelectedScholar(null)
                }}
                className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                  selectedCategory === key
                    ? 'border-yellow-400 bg-yellow-400/20 shadow-lg shadow-yellow-400/25'
                    : 'border-gray-600 bg-gray-800/50 hover:border-yellow-400/50'
                }`}
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-400">{category.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="ابحث عن عالم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Scholar Detail Modal */}
        {selectedScholar && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-yellow-400">{selectedScholar.name}</h2>
                  <button
                    onClick={() => setSelectedScholar(null)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-yellow-400 mb-2">الاسم بالإنجليزية</h3>
                    <p className="text-gray-300">{selectedScholar.nameEn}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-yellow-400 mb-2">اللقب</h3>
                    <p className="text-gray-300">{selectedScholar.title}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-yellow-400 mb-2">الفترة الزمنية</h3>
                    <p className="text-gray-300">{selectedScholar.period}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-yellow-400 mb-2">نبذة</h3>
                    <p className="text-gray-300 leading-relaxed">{selectedScholar.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-yellow-400 mb-2">أهم الإنجازات</h3>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      {selectedScholar.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-yellow-400 mb-2">أهم المؤلفات</h3>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      {selectedScholar.books.map((book, index) => (
                        <li key={index}>{book}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scholars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholars.map((scholar) => (
            <div
              key={scholar.id}
              className="bg-gray-800/50 rounded-lg p-6 border border-gray-600 hover:border-yellow-400/50 transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedScholar(scholar)}
            >
              <h3 className="text-xl font-bold text-yellow-400 mb-2">{scholar.name}</h3>
              <p className="text-gray-400 text-sm mb-2">{scholar.nameEn}</p>
              <p className="text-orange-400 font-semibold mb-3">{scholar.title}</p>
              <p className="text-gray-300 text-sm mb-3 line-clamp-3">{scholar.description}</p>
              <p className="text-gray-500 text-xs">{scholar.period}</p>
              
              <div className="mt-4 pt-4 border-t border-gray-600">
                <p className="text-xs text-gray-400">انقر للمزيد من التفاصيل</p>
              </div>
            </div>
          ))}
        </div>

        {filteredScholars.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">لا توجد نتائج للبحث</p>
          </div>
        )}
      </div>
    </div>
  )
}

