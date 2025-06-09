import { useState, useEffect } from 'react'

const HADITH_API_BASE = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1'

const hadithBooks = [
  { id: 'bukhari', name: 'صحيح البخاري' },
  { id: 'muslim', name: 'صحيح مسلم' },
  { id: 'tirmidhi', name: 'سنن الترمذي' },
  { id: 'nasai', name: 'سنن النسائي' },
  { id: 'abudawood', name: 'سنن أبي داود' },
  { id: 'ibnmajah', name: 'سنن ابن ماجه' },
  { id: 'malik', name: 'موطأ مالك' }
]

const getBook = async (bookId) => {
  const res = await fetch(`${HADITH_API_BASE}/${bookId}/ar.json`)
  return await res.json()
}

export default function HadithCollection() {
  const [selectedBook, setSelectedBook] = useState('bukhari')
  const [hadiths, setHadiths] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [bookInfo, setBookInfo] = useState(null)
  const [selectedHadith, setSelectedHadith] = useState(null)

  const hadithsPerPage = 15

  useEffect(() => {
    fetchHadiths()
  }, [selectedBook])

  const fetchHadiths = async () => {
    setLoading(true)
    try {
      const data = await getBook(selectedBook)
      if (data) {
        setHadiths(data.hadiths || [])
        setBookInfo(data.metadata)
        setCurrentPage(1)
      }
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const filtered = hadiths.filter(h => h.text && h.text.includes(searchTerm))
  const paginated = filtered.slice((currentPage - 1) * hadithsPerPage, currentPage * hadithsPerPage)
  const totalPages = Math.ceil(filtered.length / hadithsPerPage)

  return (
    <div className="p-6 text-white bg-gray-800 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <select
          value={selectedBook}
          onChange={(e) => setSelectedBook(e.target.value)}
          className="bg-gray-700 p-2 rounded text-white"
        >
          {hadithBooks.map((book) => (
            <option key={book.id} value={book.id}>{book.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="ابحث عن حديث"
          className="bg-gray-700 p-2 rounded text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p>جاري التحميل...</p>
      ) : (
        <div>
          {paginated.map((h, i) => (
            <button
              key={i}
              onClick={() => setSelectedHadith(h)}
              className="block w-full text-right border-b border-gray-600 py-4 hover:bg-gray-700"
            >
              <p>حديث رقم {h.hadithnumber || ((currentPage - 1) * hadithsPerPage + i + 1)}</p>
              <p dir="rtl">{h.text.slice(0, 100)}...</p>
            </button>
          ))}
        </div>
      )}

      {selectedHadith && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-gray-900 text-white p-6 rounded-lg max-w-xl w-full">
            <h3 className="text-xl font-bold mb-4">حديث رقم {selectedHadith.hadithnumber}</h3>
            <div dir="rtl" className="mb-4">{selectedHadith.text}</div>
            {selectedHadith.grades?.length > 0 && (
              <div className="mb-2"><strong>الدرجة:</strong> {selectedHadith.grades[0]}</div>
            )}
            {bookInfo?.section && selectedHadith.section && (
              <div className="mb-2"><strong>الباب:</strong> {bookInfo.section[selectedHadith.section]}</div>
            )}
            <button
              onClick={() => setSelectedHadith(null)}
              className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
          className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
        >
          السابق
        </button>
        <span>صفحة {currentPage} من {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(p => p + 1)}
          className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
        >
          التالي
        </button>
      </div>
    </div>
  )
}
