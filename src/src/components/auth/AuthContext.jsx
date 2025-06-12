import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('islamicWebsiteUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    // Simple client-side authentication
    const users = JSON.parse(localStorage.getItem('islamicWebsiteUsers') || '[]')
    const user = users.find(u => u.email === email && u.password === password)
    
    if (user) {
      const userWithoutPassword = { ...user }
      delete userWithoutPassword.password
      setUser(userWithoutPassword)
      localStorage.setItem('islamicWebsiteUser', JSON.stringify(userWithoutPassword))
      return { success: true }
    } else {
      return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }
    }
  }

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('islamicWebsiteUsers') || '[]')
    
    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
      return { success: false, error: 'البريد الإلكتروني مستخدم بالفعل' }
    }

    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      createdAt: new Date().toISOString(),
      preferences: {
        favoriteAzkar: [],
        favoriteDuas: [],
        readSurahs: [],
        quizProgress: {},
        lastReadSurah: 1,
        theme: 'light'
      }
    }

    users.push(newUser)
    localStorage.setItem('islamicWebsiteUsers', JSON.stringify(users))

    const userWithoutPassword = { ...newUser }
    delete userWithoutPassword.password
    setUser(userWithoutPassword)
    localStorage.setItem('islamicWebsiteUser', JSON.stringify(userWithoutPassword))

    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('islamicWebsiteUser')
  }

  const updateUserPreferences = (preferences) => {
    if (!user) return

    const updatedUser = {
      ...user,
      preferences: { ...user.preferences, ...preferences }
    }

    setUser(updatedUser)
    localStorage.setItem('islamicWebsiteUser', JSON.stringify(updatedUser))

    // Also update in users array
    const users = JSON.parse(localStorage.getItem('islamicWebsiteUsers') || '[]')
    const userIndex = users.findIndex(u => u.id === user.id)
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], preferences: updatedUser.preferences }
      localStorage.setItem('islamicWebsiteUsers', JSON.stringify(users))
    }
  }

  const addToFavorites = (type, item) => {
    if (!user) return

    const currentFavorites = user.preferences[`favorite${type}`] || []
    if (!currentFavorites.find(fav => fav.id === item.id)) {
      const updatedFavorites = [...currentFavorites, item]
      updateUserPreferences({ [`favorite${type}`]: updatedFavorites })
    }
  }

  const removeFromFavorites = (type, itemId) => {
    if (!user) return

    const currentFavorites = user.preferences[`favorite${type}`] || []
    const updatedFavorites = currentFavorites.filter(fav => fav.id !== itemId)
    updateUserPreferences({ [`favorite${type}`]: updatedFavorites })
  }

  const markSurahAsRead = (surahNumber) => {
    if (!user) return

    const readSurahs = user.preferences.readSurahs || []
    if (!readSurahs.includes(surahNumber)) {
      const updatedReadSurahs = [...readSurahs, surahNumber]
      updateUserPreferences({ 
        readSurahs: updatedReadSurahs,
        lastReadSurah: surahNumber
      })
    }
  }

  const updateQuizProgress = (quizType, score, total) => {
    if (!user) return

    const quizProgress = user.preferences.quizProgress || {}
    quizProgress[quizType] = {
      score,
      total,
      percentage: Math.round((score / total) * 100),
      completedAt: new Date().toISOString()
    }
    updateUserPreferences({ quizProgress })
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUserPreferences,
    addToFavorites,
    removeFromFavorites,
    markSurahAsRead,
    updateQuizProgress
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

