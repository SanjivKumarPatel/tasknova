import { createContext, useState } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return (
      localStorage.getItem('token') ||
      sessionStorage.getItem('token')
    )
  })

  const [user, setUser] = useState(() => {
    const storedUser =
      localStorage.getItem('user') ||
      sessionStorage.getItem('user')

    if (!storedUser) {
      return null
    }

    try {
      return JSON.parse(storedUser)
    } catch (error) {
      console.error('Failed to restore user session:', error)
      localStorage.removeItem('user')
      sessionStorage.removeItem('user')
      return null
    }
  })

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!(
      localStorage.getItem('token') ||
      sessionStorage.getItem('token')
    )
  })

  const loading = false

  const register = (userData, userToken) => {
    setUser(userData)
    setToken(userToken)
    setIsLoggedIn(true)

    localStorage.setItem('token', userToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

const login = (userData, userToken, rememberMe = false) => {
  setUser(userData)
  setToken(userToken)
  setIsLoggedIn(true)

  // Clear any previous session
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('user')

  if (rememberMe) {
    // Remember Me ON → persist after browser closes
    localStorage.setItem('token', userToken)
    localStorage.setItem('user', JSON.stringify(userData))
  } else {
    // Remember Me OFF → only current browser session
    sessionStorage.setItem('token', userToken)
    sessionStorage.setItem('user', JSON.stringify(userData))
  }
}

const updateUser = (updateUserData) => {
  setUser(updateUserData)

  if (localStorage.getItem('token')) {
    localStorage.setItem('user', JSON.stringify(updateUserData))
  }

  if (sessionStorage.getItem('token')) {
    sessionStorage.setItem('user', JSON.stringify(updateUserData))
  }
}

  const logout = () => {
    setUser(null)
    setToken(null)
    setIsLoggedIn(false)

    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('rememberToken')
    localStorage.removeItem('rememberEnabled')

    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        register,
        isLoggedIn,
        login,
        updateUser,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}