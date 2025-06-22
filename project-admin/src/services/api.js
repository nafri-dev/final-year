import axios from "axios"
import { VITE_FRONTEND_URL } from "../config"

// Create an axios instance with default config
const api = axios.create({
  baseURL: VITE_FRONTEND_URL,
})

// Add a request interceptor to include the auth token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Auth services
export const authService = {
  login: async (email, password) => {
    const response = await api.post("/admin/login", { email, password })
    return response.data
  },

  verifyToken: async () => {
    try {
      const response = await api.get("/admin/verify")
      return response.data
    } catch (error) {
      console.error("Token verification error:", error)
      throw error
    }
  },
}

// Dashboard services
export const dashboardService = {
  getStats: async () => {
    const response = await api.get("/admin/stats")
    return response.data
  },

  getOrdersByStatus: async () => {
    const response = await api.get("/admin/orders/by-status")
    return response.data
  },

  getSalesByDay: async () => {
    const response = await api.get("/admin/sales/by-day")
    return response.data
  },
}

// Order services
export const orderService = {
  getAllOrders: async () => {
    const response = await api.get("/admin/orders")
    return response.data
  },

  getOrderById: async (id) => {
    try {
      console.log(`Fetching order with ID: ${id}`)
      const response = await api.get(`/admin/orders/${id}`)
      console.log("Order details response:", response.data)
      return response.data
    } catch (error) {
      console.error("Error fetching order details:", error)

      // Add more detailed error information
      let errorMessage = "Failed to fetch order details"
      if (error.response) {
        errorMessage += `: ${error.response.status} ${error.response.statusText}`
        if (error.response.data && error.response.data.message) {
          errorMessage += ` - ${error.response.data.message}`
        }
      }

      throw new Error(errorMessage)
    }
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/admin/orders/${id}/status`, { status })
    return response.data
  },
}

// Product services
export const productService = {
  getAllProducts: async () => {
    const response = await api.get("/admin/products")
    return response.data
  },

  getProductById: async (id) => {
    const response = await api.get(`/admin/products/${id}`)
    return response.data
  },

  createProduct: async (productData) => {
    const response = await api.post("/admin/products", productData)
    return response.data
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`/admin/products/${id}`, productData)
    return response.data
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/admin/products/${id}`)
    return response.data
  },

  uploadImage: async (formData) => {
    const response = await api.post("/admin/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },
}

// Category services
export const categoryService = {
  getAllCategories: async () => {
    const response = await api.get("/admin/categories")
    return response.data
  },
}

export default {
  auth: authService,
  dashboard: dashboardService,
  orders: orderService,
  products: productService,
  categories: categoryService,
}

