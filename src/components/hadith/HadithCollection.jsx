// الكود الكامل مع API endpoints المضمونة من Hadith API

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

// API call helpers
async function getAllEditions() {
  const res = await fetch(`${HADITH_API_BASE}/editions.json`)
  return res.ok ? res.json() : null
}

async function getBook(book) {
  const res = await fetch(`${HADITH_API_BASE}/editions/ara-${book}.json`)
  return res.ok ? res.json() : null
}

async function getHadithByNumber(book, number) {
  const res = await fetch(`${HADITH_API_BASE}/editions/ara-${book}/${number}.json`)
  return res.ok ? res.json() : null
}

async function getSectionOrHadith(book, section) {
  const sectionRes = await fetch(`${HADITH_API_BASE}/editions/ara-${book}/sections/${section}.json`)
  if (sectionRes.ok) return sectionRes.json()
  return getHadithByNumber(book, section)
}

export default function HadithCollection() {
  const [selectedBook, setSelectedBook] = useState('bukhari')
  const [hadiths, setHadiths] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [bookInfo, setBookInfo] = useState(null)

  useEffect(() => {
    fetchHadiths()
  }, [selectedBook, currentPage])

  const fetchHadiths = async () => {
    setLoading(true)
    try {
      const data = await getSectionOrHadith(selectedBook, currentPage)
      if (data) {
        setHadiths(data.hadiths || [])
        setBookInfo(data.metadata)
      }
    } catch (err) {
      console.error('حدث خطأ عند جلب الأحاديث:', err)
    }
    setLoading(false)
  }

  const filteredHadiths = hadiths.filter(h => h.text && h.text.includes(searchTerm))

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-3xl font-bold text-yellow-400 text-center mb-4">الحديث الشريف</h1>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {Object.entries(hadithBooks).map(([key, b]) => (
          <button
            key={key}
            onClick={() => { setSelectedBook(key); setCurrentPage(1) }}
            className={`p-4 border rounded-lg ${selectedBook === key ? 'border-yellow-400 bg-yellow-900/30' : 'border-gray-600 bg-gray-800'}`}
          >
            <h2 className="text-lg font-bold text-yellow-300">{b.name}</h2>
            <p className="text-sm text-gray-400">{b.nameEn}</p>
            <p className="text-xs text-gray-500 mt-1">{b.description}</p>
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="ابحث في الأحاديث..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-6 rounded bg-gray-800 border border-gray-600 text-white"
      />

      {loading ? <p className="text-center">جاري التحميل...</p> : (
        <div className="space-y-4">
          {filteredHadiths.length ? filteredHadiths.map((hadith, i) => (
            <div key={i} className="p-4 border border-gray-700 rounded bg-gray-800">
              <p className="text-yellow-300 mb-2">حديث رقم {hadith.hadithnumber || i + 1}</p>
              <p dir="rtl" className="text-lg leading-loose">{hadith.text}</p>
              {hadith.reference && (
                <p className="mt-2 text-sm text-gray-400">المرجع: {hadith.reference.book} - {hadith.reference.hadith}</p>
              )}
            </div>
          )) : <p className="text-center text-gray-400">لا توجد أحاديث</p>}
        </div>
      )}

      <div className="flex justify-center mt-6 gap-4">
        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded">السابق</button>
        <span className="px-4 py-2 bg-yellow-500 text-black rounded">القسم {currentPage}</span>
        <button onClick={() => setCurrentPage(p => p + 1)} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded">التالي</button>
      </div>
    </div>
  )
}
