"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { authService } from "../services/api"

const AuthContext = createContext(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("adminToken")

      if (token) {
        try {
          const response = await authService.verifyToken()

          if (response.user) {
            setUser({
              id: response.user.id,
              email: response.user.email,
              name: response.user.name || response.user.email.split("@")[0],
            })
          } else {
            localStorage.removeItem("adminToken")
          }
        } catch (error) {
          console.error("Authentication error:", error)
          localStorage.removeItem("adminToken")
        }
      }

      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const { token, user } = await authService.login(email, password)

      // Store the token in localStorage
      localStorage.setItem("adminToken", token)

      // Set the user state
      setUser({
        id: user.id,
        email: user.email,
        name: user.name || user.email.split("@")[0],
      })
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("adminToken")
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

