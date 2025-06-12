import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  User, 
  BookOpen, 
  Heart, 
  Trophy, 
  Calendar,
  Settings,
  LogOut,
  Star,
  Clock,
  Target,
  TrendingUp
} from 'lucide-react'
import { useAuth } from '../auth/AuthContext.jsx'
import { Link } from 'react-router-dom'

const UserDashboard = () => {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="title-text text-2xl font-bold text-gray-800 mb-4">
            يجب تسجيل الدخول أولاً
          </h1>
          <Link to="/">
            <Button className="arabic-text">العودة للصفحة الرئيسية</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  const getReadingProgress = () => {
    const readSurahs = user.preferences?.readSurahs || []
    return Math.round((readSurahs.length / 114) * 100)
  }

  const getQuizStats = () => {
    const quizProgress = user.preferences?.quizProgress || {}
    const quizzes = Object.values(quizProgress)
    if (quizzes.length === 0) return { average: 0, total: 0 }
    
    const average = quizzes.reduce((sum, quiz) => sum + quiz.percentage, 0) / quizzes.length
    return { average: Math.round(average), total: quizzes.length }
  }

  const StatCard = ({ icon: Icon, title, value, description, color = 'blue' }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="arabic-text text-sm text-gray-600 mb-1">{title}</p>
            <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
            <p className="arabic-text text-xs text-gray-500">{description}</p>
          </div>
          <div className={`p-3 bg-${color}-100 rounded-full`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const FavoriteItem = ({ item, type, onRemove }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <h4 className="arabic-text font-medium text-gray-800">{item.title}</h4>
        {item.description && (
          <p className="arabic-text text-sm text-gray-600 mt-1">{item.description}</p>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(type, item.id)}
        className="text-red-500 hover:text-red-700"
      >
        إزالة
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="title-text text-2xl font-bold text-gray-800">
                  مرحباً، {user.name}
                </h1>
                <p className="arabic-text text-gray-600">
                  عضو منذ {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="arabic-text"
            >
              <LogOut className="h-4 w-4 mr-2" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="arabic-text">نظرة عامة</TabsTrigger>
            <TabsTrigger value="favorites" className="arabic-text">المفضلة</TabsTrigger>
            <TabsTrigger value="progress" className="arabic-text">التقدم</TabsTrigger>
            <TabsTrigger value="settings" className="arabic-text">الإعدادات</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={BookOpen}
                title="السور المقروءة"
                value={user.preferences?.readSurahs?.length || 0}
                description="من أصل 114 سورة"
                color="green"
              />
              <StatCard
                icon={Heart}
                title="الأذكار المفضلة"
                value={user.preferences?.favoriteAzkar?.length || 0}
                description="أذكار محفوظة"
                color="red"
              />
              <StatCard
                icon={Trophy}
                title="المسابقات"
                value={getQuizStats().total}
                description={`متوسط النتائج ${getQuizStats().average}%`}
                color="yellow"
              />
              <StatCard
                icon={Calendar}
                title="أيام النشاط"
                value="15"
                description="هذا الشهر"
                color="blue"
              />
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="title-text text-xl">النشاط الأخير</CardTitle>
                <CardDescription className="arabic-text">
                  آخر الأنشطة التي قمت بها
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="arabic-text text-sm font-medium">
                        قراءة سورة {user.preferences?.lastReadSurah ? `رقم ${user.preferences.lastReadSurah}` : 'الفاتحة'}
                      </p>
                      <p className="arabic-text text-xs text-gray-500">منذ ساعتين</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="arabic-text text-sm font-medium">
                        مراجعة مواقيت الصلاة
                      </p>
                      <p className="arabic-text text-xs text-gray-500">منذ 4 ساعات</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="title-text text-xl">إجراءات سريعة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link to="/quran">
                    <Button variant="outline" className="w-full arabic-text">
                      <BookOpen className="h-4 w-4 mr-2" />
                      قراءة القرآن
                    </Button>
                  </Link>
                  <Link to="/azkar">
                    <Button variant="outline" className="w-full arabic-text">
                      <Heart className="h-4 w-4 mr-2" />
                      الأذكار
                    </Button>
                  </Link>
                  <Link to="/qibla">
                    <Button variant="outline" className="w-full arabic-text">
                      <Target className="h-4 w-4 mr-2" />
                      اتجاه القبلة
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full arabic-text">
                    <Trophy className="h-4 w-4 mr-2" />
                    مسابقة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="title-text text-xl">الأذكار المفضلة</CardTitle>
                  <CardDescription className="arabic-text">
                    الأذكار التي أضفتها إلى المفضلة
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {user.preferences?.favoriteAzkar?.length > 0 ? (
                      user.preferences.favoriteAzkar.map((item) => (
                        <FavoriteItem
                          key={item.id}
                          item={item}
                          type="Azkar"
                          onRemove={() => {}}
                        />
                      ))
                    ) : (
                      <p className="arabic-text text-gray-500 text-center py-8">
                        لم تضف أي أذكار إلى المفضلة بعد
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="title-text text-xl">الأدعية المفضلة</CardTitle>
                  <CardDescription className="arabic-text">
                    الأدعية التي أضفتها إلى المفضلة
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {user.preferences?.favoriteDuas?.length > 0 ? (
                      user.preferences.favoriteDuas.map((item) => (
                        <FavoriteItem
                          key={item.id}
                          item={item}
                          type="Duas"
                          onRemove={() => {}}
                        />
                      ))
                    ) : (
                      <p className="arabic-text text-gray-500 text-center py-8">
                        لم تضف أي أدعية إلى المفضلة بعد
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="title-text text-xl">تقدم قراءة القرآن</CardTitle>
                  <CardDescription className="arabic-text">
                    نسبة السور التي قرأتها من القرآن الكريم
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="arabic-text text-sm font-medium">
                        {user.preferences?.readSurahs?.length || 0} من 114 سورة
                      </span>
                      <span className="text-sm font-medium">
                        {getReadingProgress()}%
                      </span>
                    </div>
                    <Progress value={getReadingProgress()} className="h-2" />
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="arabic-text text-sm text-gray-600">
                        استمر في القراءة لإكمال القرآن الكريم
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="title-text text-xl">نتائج المسابقات</CardTitle>
                  <CardDescription className="arabic-text">
                    أداؤك في المسابقات والاختبارات
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(user.preferences?.quizProgress || {}).length > 0 ? (
                      Object.entries(user.preferences.quizProgress).map(([quizType, progress]) => (
                        <div key={quizType} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="arabic-text font-medium">{quizType}</h4>
                            <p className="arabic-text text-sm text-gray-600">
                              {progress.score} من {progress.total} إجابة صحيحة
                            </p>
                          </div>
                          <Badge variant={progress.percentage >= 80 ? 'default' : 'secondary'}>
                            {progress.percentage}%
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="arabic-text text-gray-500 text-center py-8">
                        لم تشارك في أي مسابقات بعد
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="title-text text-xl">إعدادات الحساب</CardTitle>
                <CardDescription className="arabic-text">
                  إدارة معلومات حسابك وتفضيلاتك
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="arabic-text font-medium mb-2">معلومات الحساب</h3>
                    <div className="space-y-2">
                      <p className="arabic-text text-sm">
                        <span className="font-medium">الاسم:</span> {user.name}
                      </p>
                      <p className="arabic-text text-sm">
                        <span className="font-medium">البريد الإلكتروني:</span> {user.email}
                      </p>
                      <p className="arabic-text text-sm">
                        <span className="font-medium">تاريخ التسجيل:</span> {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="arabic-text font-medium mb-2">التفضيلات</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="arabic-text text-sm">المظهر</span>
                        <Badge variant="outline">فاتح</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="arabic-text text-sm">اللغة</span>
                        <Badge variant="outline">العربية</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button
                      onClick={handleLogout}
                      variant="destructive"
                      className="arabic-text"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      تسجيل الخروج
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default UserDashboard

