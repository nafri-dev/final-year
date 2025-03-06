import axios from "axios"

const API_BASE_URL = "http://localhost:3000/api"

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

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
// api starts here
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

export const getCartByUser = async (userId) => {
  try {
    const response = await axiosInstance.get(`/cart/user/${userId}`)
    return response.data
  } catch (error) {
    handleApiError(error, "Failed to fetch user cart")
  }
}

export const addToCart = async (userId, productId, quantity, productName, price, imageUrl, size, color) => {
  try {
    const response = await axiosInstance.post("/cart/add", {
      userId,
      productId: productId.toString(),
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


export const placeOrder = async (userId, totalAmount) => {
  try {
    const response = await axiosInstance.post("/orders/place", {
      userId: userId.toString(),
      totalAmount: Number(totalAmount),
    })
    return response.data
  } catch (error) {
    handleApiError(error, "Failed to place order")
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

export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await axiosInstance.put(`/orders/${orderId}/status`, { status: newStatus })
    return response.data
  } catch (error) {
    handleApiError(error, "Failed to update order status")
  }
}

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

