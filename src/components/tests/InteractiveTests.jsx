import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, Trophy, BookOpen, Brain, Star } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'

// Sample test data - in a real app, this would come from an API
const testCategories = {
  quran: {
    name: 'حفظ القرآن',
    icon: '📖',
    description: 'اختبارات في حفظ القرآن الكريم',
    tests: [
      {
        id: 1,
        title: 'سورة الفاتحة',
        difficulty: 'سهل',
        questions: 5,
        timeLimit: 300, // 5 minutes
        questions_data: [
          {
            id: 1,
            question: 'ما هي الآية التي تأتي بعد "الحمد لله رب العالمين"؟',
            options: [
              'الرحمن الرحيم',
              'مالك يوم الدين',
              'إياك نعبد وإياك نستعين',
              'اهدنا الصراط المستقيم'
            ],
            correct: 0,
            explanation: 'الآية التي تأتي بعد "الحمد لله رب العالمين" هي "الرحمن الرحيم"'
          },
          {
            id: 2,
            question: 'كم عدد آيات سورة الفاتحة؟',
            options: ['6 آيات', '7 آيات', '8 آيات', '9 آيات'],
            correct: 1,
            explanation: 'سورة الفاتحة تحتوي على 7 آيات'
          },
          {
            id: 3,
            question: 'ما معنى "صراط الذين أنعمت عليهم"؟',
            options: [
              'طريق الكافرين',
              'طريق الأنبياء والصالحين',
              'طريق الضالين',
              'طريق المغضوب عليهم'
            ],
            correct: 1,
            explanation: 'صراط الذين أنعمت عليهم يعني طريق الأنبياء والصالحين والشهداء'
          },
          {
            id: 4,
            question: 'ما هو اسم آخر لسورة الفاتحة؟',
            options: ['أم الكتاب', 'السبع المثاني', 'الحمد', 'جميع ما سبق'],
            correct: 3,
            explanation: 'سورة الفاتحة لها عدة أسماء منها: أم الكتاب، السبع المثاني، الحمد'
          },
          {
            id: 5,
            question: 'في أي جزء من القرآن توجد سورة الفاتحة؟',
            options: ['الجزء الأول', 'الجزء الثاني', 'الجزء الثالث', 'الجزء الرابع'],
            correct: 0,
            explanation: 'سورة الفاتحة توجد في الجزء الأول من القرآن الكريم'
          }
        ]
      },
      {
        id: 2,
        title: 'قصار السور',
        difficulty: 'متوسط',
        questions: 10,
        timeLimit: 600,
        questions_data: [
          {
            id: 1,
            question: 'ما هي أقصر سورة في القرآن الكريم؟',
            options: ['الكوثر', 'النصر', 'الإخلاص', 'الفلق'],
            correct: 0,
            explanation: 'سورة الكوثر هي أقصر سورة في القرآن الكريم وتحتوي على 3 آيات'
          }
          // More questions would be added here
        ]
      }
    ]
  },
  hadith: {
    name: 'الحديث الشريف',
    icon: '📚',
    description: 'اختبارات في الأحاديث النبوية',
    tests: [
      {
        id: 3,
        title: 'الأحاديث الأربعين النووية',
        difficulty: 'متوسط',
        questions: 8,
        timeLimit: 480,
        questions_data: [
          {
            id: 1,
            question: 'من قال: "إنما الأعمال بالنيات"؟',
            options: ['عمر بن الخطاب', 'أبو بكر الصديق', 'علي بن أبي طالب', 'عثمان بن عفان'],
            correct: 0,
            explanation: 'هذا الحديث رواه عمر بن الخطاب رضي الله عنه'
          }
          // More questions would be added here
        ]
      }
    ]
  },
  fiqh: {
    name: 'الفقه الإسلامي',
    icon: '⚖️',
    description: 'اختبارات في أحكام الفقه',
    tests: [
      {
        id: 4,
        title: 'أحكام الطهارة',
        difficulty: 'سهل',
        questions: 6,
        timeLimit: 360,
        questions_data: [
          {
            id: 1,
            question: 'كم عدد فرائض الوضوء؟',
            options: ['3', '4', '5', '6'],
            correct: 1,
            explanation: 'فرائض الوضوء أربعة: غسل الوجه، غسل اليدين إلى المرفقين، مسح الرأس، غسل الرجلين إلى الكعبين'
          }
          // More questions would be added here
        ]
      }
    ]
  }
}

export default function InteractiveTests() {
  const [selectedCategory, setSelectedCategory] = useState('quran')
  const [currentTest, setCurrentTest] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answers, setAnswers] = useState([])
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const { user } = useAuth()

  // Timer effect
  useEffect(() => {
    if (testStarted && timeLeft > 0 && !testCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && testStarted) {
      handleTestComplete()
    }
  }, [timeLeft, testStarted, testCompleted])

  const startTest = (test) => {
    setCurrentTest(test)
    setCurrentQuestion(0)
    setAnswers([])
    setSelectedAnswer(null)
    setShowResult(false)
    setTimeLeft(test.timeLimit)
    setTestStarted(true)
    setTestCompleted(false)
  }

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNextQuestion = () => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = selectedAnswer
    setAnswers(newAnswers)
    setSelectedAnswer(null)

    if (currentQuestion < currentTest.questions_data.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleTestComplete()
    }
  }

  const handleTestComplete = () => {
    const finalAnswers = [...answers]
    if (selectedAnswer !== null) {
      finalAnswers[currentQuestion] = selectedAnswer
    }
    setAnswers(finalAnswers)
    setTestCompleted(true)
    setTestStarted(false)
    setShowResult(true)
  }

  const calculateScore = () => {
    let correct = 0
    answers.forEach((answer, index) => {
      if (answer === currentTest.questions_data[index]?.correct) {
        correct++
      }
    })
    return correct
  }

  const getScorePercentage = () => {
    return Math.round((calculateScore() / currentTest.questions_data.length) * 100)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const resetTest = () => {
    setCurrentTest(null)
    setCurrentQuestion(0)
    setAnswers([])
    setSelectedAnswer(null)
    setShowResult(false)
    setTimeLeft(0)
    setTestStarted(false)
    setTestCompleted(false)
  }

  if (showResult) {
    const score = calculateScore()
    const percentage = getScorePercentage()
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-600 text-center">
              <div className="mb-6">
                {percentage >= 80 ? (
                  <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                ) : percentage >= 60 ? (
                  <Star className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                ) : (
                  <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                )}
                
                <h2 className="text-3xl font-bold text-yellow-400 mb-2">
                  انتهى الاختبار!
                </h2>
                <p className="text-xl text-gray-300">
                  {currentTest.title}
                </p>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-6 mb-6">
                <div className="text-4xl font-bold text-yellow-400 mb-2">
                  {score} / {currentTest.questions_data.length}
                </div>
                <div className="text-2xl text-gray-300 mb-4">
                  {percentage}%
                </div>
                
                <div className="w-full bg-gray-600 rounded-full h-4 mb-4">
                  <div 
                    className={`h-4 rounded-full transition-all duration-500 ${
                      percentage >= 80 ? 'bg-green-500' : 
                      percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                <p className="text-gray-400">
                  {percentage >= 80 ? 'ممتاز! أداء رائع' : 
                   percentage >= 60 ? 'جيد! يمكنك التحسن' : 'يحتاج إلى مراجعة'}
                </p>
              </div>

              {/* Detailed Results */}
              <div className="text-left mb-6">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">تفاصيل الإجابات:</h3>
                <div className="space-y-3">
                  {currentTest.questions_data.map((question, index) => (
                    <div key={index} className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        {answers[index] === question.correct ? (
                          <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-gray-300 mb-2">{question.question}</p>
                          <p className="text-sm text-gray-400">
                            الإجابة الصحيحة: {question.options[question.correct]}
                          </p>
                          {answers[index] !== question.correct && (
                            <p className="text-sm text-red-400">
                              إجابتك: {question.options[answers[index]] || 'لم تجب'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 justify-center">
                <button
                  onClick={resetTest}
                  className="bg-yellow-400 text-black px-6 py-3 rounded-lg hover:bg-yellow-500 transition-colors"
                >
                  اختبار آخر
                </button>
                <button
                  onClick={() => startTest(currentTest)}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition-colors"
                >
                  إعادة الاختبار
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentTest && testStarted) {
    const question = currentTest.questions_data[currentQuestion]
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Test Header */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-yellow-400">{currentTest.title}</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-red-400">
                    <Clock className="w-5 h-5 mr-2" />
                    <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between text-sm text-gray-400">
                <span>السؤال {currentQuestion + 1} من {currentTest.questions_data.length}</span>
                <span>الصعوبة: {currentTest.difficulty}</span>
              </div>
              
              <div className="w-full bg-gray-600 rounded-full h-2 mt-4">
                <div 
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / currentTest.questions_data.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600 mb-6">
              <h3 className="text-xl font-bold text-white mb-6">{question.question}</h3>
              
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-4 text-right rounded-lg border-2 transition-all duration-200 ${
                      selectedAnswer === index
                        ? 'border-yellow-400 bg-yellow-400/20 text-yellow-400'
                        : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-yellow-400/50'
                    }`}
                  >
                    <span className="font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={resetTest}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition-colors"
              >
                إنهاء الاختبار
              </button>
              
              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  selectedAnswer !== null
                    ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {currentQuestion < currentTest.questions_data.length - 1 ? 'السؤال التالي' : 'إنهاء الاختبار'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            الاختبارات التفاعلية
          </h1>
          <p className="text-xl text-gray-300">
            اختبر معلوماتك في القرآن الكريم والحديث الشريف والفقه الإسلامي
          </p>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(testCategories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                  selectedCategory === key
                    ? 'border-yellow-400 bg-yellow-400/20 shadow-lg shadow-yellow-400/25'
                    : 'border-gray-600 bg-gray-800/50 hover:border-yellow-400/50'
                }`}
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-400">{category.description}</p>
                <div className="mt-4 text-sm text-gray-500">
                  {category.tests.length} اختبار متاح
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tests List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testCategories[selectedCategory].tests.map((test) => (
            <div key={test.id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-600 hover:border-yellow-400/50 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-2">{test.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {test.questions} سؤال
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {Math.floor(test.timeLimit / 60)} دقيقة
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  test.difficulty === 'سهل' ? 'bg-green-500/20 text-green-400' :
                  test.difficulty === 'متوسط' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {test.difficulty}
                </span>
              </div>

              <button
                onClick={() => startTest(test)}
                className="w-full bg-yellow-400 text-black py-3 rounded-lg hover:bg-yellow-500 transition-colors font-bold"
              >
                بدء الاختبار
              </button>
            </div>
          ))}
        </div>

        {/* User Stats */}
        {user && (
          <div className="mt-12 bg-gray-800/50 rounded-lg p-6 border border-gray-600">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">إحصائياتك</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">12</div>
                <div className="text-sm text-gray-400">اختبار مكتمل</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">85%</div>
                <div className="text-sm text-gray-400">متوسط النتائج</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">45</div>
                <div className="text-sm text-gray-400">دقائق الدراسة</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">7</div>
                <div className="text-sm text-gray-400">شارات محققة</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

