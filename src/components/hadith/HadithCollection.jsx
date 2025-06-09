import { useState, useEffect } from 'react'

const HADITH_API_BASE = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1'

const hadithBooks = {
  'bukhari': { name: 'صحيح البخاري', nameEn: 'Sahih al-Bukhari', description: 'أصح كتاب بعد كتاب الله' },
  'muslim': { name: 'صحيح مسلم', nameEn: 'Sahih Muslim', description: 'ثاني أصح الكتب بعد البخاري' },
  'abudawud': { name: 'سنن أبي داود', nameEn: 'Sunan Abu Dawud', description: 'من كتب السنن الأربعة' },
  'tirmidhi': { name: 'سنن الترمذي', nameEn: 'Jami at-Tirmidhi', description: 'من كتب السنن الأربعة' },
  'nasai': { name: 'سنن النسائي', nameEn: 'Sunan an-Nasai', description: 'من كتب السنن الأربعة' },
  'ibnmajah': { name: 'سنن ابن ماجه', nameEn: 'Sunan Ibn Majah', description: 'من كتب السنن الأربعة' }
}

export default function HadithCollection() {
  const [selectedBook, setSelectedBook] = useState('bukhari')
  const [hadiths, setHadiths] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSection, setSelectedSection] = useState(null)
  const [bookInfo, setBookInfo] = useState(null)

  useEffect(() => {
    fetchHadiths()
  }, [selectedBook, currentPage])

  const fetchHadiths = async () => {
    setLoading(true)
    try {
      // Fetch a section of hadiths (sections 1-10 for demonstration)
      const sectionNumber = currentPage
      const response = await fetch(`${HADITH_API_BASE}/editions/ara-${selectedBook}/sections/${sectionNumber}.json`)
      
      if (response.ok) {
        const data = await response.json()
        setHadiths(data.hadiths || [])
        setBookInfo(data.metadata)
      } else {
        // Fallback to individual hadith if sections don't work
        const hadithResponse = await fetch(`${HADITH_API_BASE}/editions/ara-${selectedBook}/${currentPage}.json`)
        if (hadithResponse.ok) {
          const hadithData = await hadithResponse.json()
          setHadiths(hadithData.hadiths || [])
          setBookInfo(hadithData.metadata)
        }
      }
    } catch (error) {
      console.error('Error fetching hadiths:', error)
    }
    setLoading(false)
  }

  const filteredHadiths = hadiths.filter(hadith =>
    hadith.text && hadith.text.includes(searchTerm)
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            الحديث الشريف
          </h1>
          <p className="text-xl text-gray-300">
            مجموعة من الأحاديث النبوية الصحيحة مصنفة حسب الأبواب الفقهية
          </p>
        </div>

        {/* Book Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">اختر كتاب الحديث</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(hadithBooks).map(([key, book]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedBook(key)
                  setCurrentPage(1)
                }}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  selectedBook === key
                    ? 'border-yellow-400 bg-yellow-400/20 shadow-lg shadow-yellow-400/25'
                    : 'border-gray-600 bg-gray-800/50 hover:border-yellow-400/50'
                }`}
              >
                <h3 className="text-lg font-bold text-yellow-400">{book.name}</h3>
                <p className="text-sm text-gray-400">{book.nameEn}</p>
                <p className="text-xs text-gray-500 mt-2">{book.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="ابحث في الأحاديث..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Book Info */}
        {bookInfo && (
          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
            <h3 className="text-xl font-bold text-yellow-400 mb-2">{bookInfo.name}</h3>
            {bookInfo.section && selectedSection && (
              <p className="text-gray-300">
                الباب: {bookInfo.section[selectedSection]} - القسم {currentPage}
              </p>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
            <p className="mt-2 text-gray-400">جاري تحميل الأحاديث...</p>
          </div>
        )}

        {/* Hadiths Display */}
        {!loading && (
          <div className="space-y-6">
            {filteredHadiths.length > 0 ? (
              filteredHadiths.map((hadith, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-6 border border-gray-600">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                      حديث رقم {hadith.hadithnumber || hadith.arabicnumber || index + 1}
                    </span>
                    {hadith.grades && hadith.grades.length > 0 && (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                        {hadith.grades[0]}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-right leading-relaxed text-lg mb-4" dir="rtl">
                    {hadith.text}
                  </div>
                  
                  {hadith.reference && (
                    <div className="text-sm text-gray-400 border-t border-gray-600 pt-3">
                      المرجع: كتاب {hadith.reference.book} - حديث {hadith.reference.hadith}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">لا توجد أحاديث متاحة في هذا القسم</p>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
          >
            السابق
          </button>
          
          <span className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-bold">
            القسم {currentPage}
          </span>
          
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            التالي
          </button>
        </div>
      </div>
    </div>
  )
}

