import axios from "axios"

const API_BASE_URL = import.meta.env.API_URL

// Update the axiosInstance to include the auth token from localStorage
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// // Add a request interceptor to include the auth token in all requests
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token")
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => Promise.reject(error),
// )

const handleApiError = (error, customMessage) => {
  console.error(customMessage, error)
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error("Error data:", error.response.data)
    console.error("Error status:", error.response.status)
    console.error("Error headers:", error.response.headers)
  } else if (error.request) {
    // The request was made but no response was received
    console.error("No response received:", error.request)
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Error message:", error.message)
  }
  throw new Error(customMessage)
}

// PRODUCT FUNCTIONS
export const getAllProducts = async () => {
  try {
    const response = await axiosInstance.get("/products")
    return response.data
  } catch (error) {
    console.error("Failed to fetch products:", error)
    throw new Error("Failed to fetch products")
  }
}

export const getProductById = async (id) => {
  try {
    const response = await axiosInstance.get(`/products/${id}`)
    return response.data
  } catch (error) {
    console.error("Error fetching product by ID:", error)
    throw new Error("Failed to fetch product")
  }
}

export const getProductsByCategory = async (category_id) => {
  try {
    const response = await axiosInstance.get(`/products/category/${category_id}`)
    return response.data
  } catch (error) {
    console.error("Error fetching products by category:", error)
    throw new Error("Failed to fetch products by category")
  }
}

export const getCategories = async () => {
  try {
    const response = await axiosInstance.get("/categories")
    return response.data
  } catch (error) {
    handleApiError(error, "Failed to fetch categories")
  }
}

export const addProduct = async (product) => {
  try {
    const response = await axiosInstance.post("/products/add", product)
    return response.data
  } catch (error) {
    console.error("Failed to add product:", error)
    throw new Error("Failed to add product")
  }
}

export const addMultipleProducts = async (products) => {
  try {
    const response = await axiosInstance.post("/products/add-multiple", products)
    return response.data
  } catch (error) {
    console.error("Error adding multiple products:", error)
    throw new Error("Failed to add multiple products")
  }
}

export const updateProduct = async (id, product) => {
  try {
    const response = await axiosInstance.put(`/products/update/${id}`, product)
    return response.data
  } catch (error) {
    console.error("Failed to update product:", error)
    throw new Error("Failed to update product")
  }
}

export const deleteProduct = async (id) => {
  try {
    await axiosInstance.delete(`/products/delete/${id}`)
  } catch (error) {
    console.error("Failed to delete product:", error)
    throw new Error("Failed to delete product")
  }
}

export const getSimilarProducts = async (categoryId, currentProductId) => {
  try {
    console.log(`Fetching similar products for category ${categoryId} and product ${currentProductId}`)
    const response = await axiosInstance.get(`/products/similar/${categoryId}/${currentProductId}`)
    console.log("Similar products response:", response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching similar products:", error)
    handleApiError(error, "Failed to fetch similar products")
    return []
  }
}

// CART FUNCTIONS
// Update the addToCart function to handle custom product IDs
export const addToCart = async (userId, productId, quantity, productName, price, imageUrl, size, color) => {
  try {
    // Make sure productId is a string
    const productIdStr = productId ? productId.toString() : ""

    const response = await axiosInstance.post("/cart/add", {
      userId,
      productId: productIdStr,
      quantity: Number(quantity),
      productName,
      price: Number(price),
      imageUrl,
      size,
      color,
    })
    return response.data
  } catch (error) {
    handleApiError(error, "Failed to add item to cart")
  }
}

export const getCartByUser = async (userId) => {
  try {
    const response = await axiosInstance.get(`/cart/user/${userId}`)
    return response.data
  } catch (error) {
    handleApiError(error, "Failed to fetch user cart")
  }
}

export const updateCartItemQuantity = async (cartItemId, quantity) => {
  try {
    const response = await axiosInstance.put(`/cart/update/${cartItemId}`, { quantity })
    return response.data
  } catch (error) {
    handleApiError(error, "Failed to update cart item quantity")
  }
}

export const removeCartItem = async (cartItemId) => {
  try {
    await axiosInstance.delete(`/cart/remove/${cartItemId}`)
  } catch (error) {
    handleApiError(error, "Failed to remove item from cart")
  }
}

// ADDRESS FUNCTIONS
export const saveAddress = async (userId, addressData) => {
  try {
    const response = await axiosInstance.post("/orders/address", {
      userId,
      ...addressData,
    })
    return response.data
  } catch (error) {
    handleApiError(error, "Failed to save address")
  }
}

export const getUserAddress = async (userId) => {
  try {
    const response = await axiosInstance.get(`/orders/address/${userId}`)
    return response.data
  } catch (error) {
    handleApiError(error, "Failed to fetch address")
  }
}

// RAZORPAY PAYMENT FUNCTIONS
export const createRazorpayOrder = async (userId, amount) => {
  try {
    const response = await axiosInstance.post("/orders/create-razorpay-order", {
      userId,
      amount,
    })
    return response.data
  } catch (error) {
    handleApiError(error, "Failed to create payment order")
  }
}

// Update the verifyRazorpayPayment function to include the user ID
export const verifyRazorpayPayment = async (userId, razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  try {
    const response = await axiosInstance.post("/orders/verify-payment", {
      userId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    })
    return response.data
  } catch (error) {
    handleApiError(error, "Failed to verify payment")
  }
}

// ORDER FUNCTIONS
// Update the placeOrder function to include better error handling
export const placeOrder = async (orderData) => {
  try {
    // Make sure all required fields are present
    if (
      !orderData.userId ||
      !orderData.totalAmount ||
      !orderData.razorpayOrderId ||
      !orderData.razorpayPaymentId ||
      !orderData.shippingAddressId
    ) {
      throw new Error("Missing required order fields")
    }

    console.log("Placing order with data:", orderData)
    const response = await axiosInstance.post("/orders/place", orderData)
    console.log("Order placed successfully:", response.data)
    return response.data
  } catch (error) {
    console.error("Order placement error details:", error.response?.data)
    console.error("Full error object:", error)

    // Create a more detailed error message
    let errorMessage = "Failed to place order"
    if (error.response?.data?.error) {
      errorMessage += `: ${error.response.data.error}`
    }

    handleApiError(error, errorMessage)
  }
}

export const getOrderById = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/orders/${orderId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching order details:", error)
    handleApiError(error, "Failed to fetch order details")
    throw error
  }
}

export const getOrders = async () => {
  try {
    const response = await axiosInstance.get("/orders")
    return response.data
  } catch (error) {
    handleApiError(error, "Failed to fetch orders")
  }
}

export const getUserOrders = async (userId) => {
  try {
    const response = await axiosInstance.get(`/orders/user/${userId}`)
    return response.data
  } catch (error) {
    handleApiError(error, "Failed to fetch user orders")
  }
}

export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await axiosInstance.put(`/orders/${orderId}/status`, { status: newStatus })
    return response.data
  } catch (error) {
    handleApiError(error, "Failed to update order status")
  }
}

// USER FUNCTIONS
export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/users/register", userData)
    return response.data
  } catch (error) {
    console.error("Error registering user:", error)
    throw error
  }
}

export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post("/users/login", credentials)
    return response.data
  } catch (error) {
    console.error("Error logging in:", error)
    throw error
  }
}

// Add a function to clear the cart after successful order
export const clearCart = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/cart/clear/${userId}`)
    return response.data
  } catch (error) {
    handleApiError(error, "Failed to clear cart")
  }
}

