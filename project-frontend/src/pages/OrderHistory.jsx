"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getUserOrders } from "../api/productApi"
import { useAuth } from "../context/AuthContext"
import toast from "react-hot-toast"
import { ChevronRight, Package } from "lucide-react"

const OrderHistory = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return

      try {
        setLoading(true)
        const response = await getUserOrders(user.id)
        setOrders(response || [])
        setError(null)
      } catch (error) {
        console.error("Error fetching orders:", error)
        setError("Failed to load your orders. Please try again.")
        toast.error("Failed to load your orders")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <div className="bg-white rounded-lg shadow-md p-8 my-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Orders</h1>
          <p className="text-red-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <div className="bg-white rounded-lg shadow-md p-8 my-8">
          <Package size={64} className="mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Orders Yet</h1>
          <p className="text-lg text-gray-600 mb-6">You havent placed any orders yet.</p>
          <Link to="/" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order._id}
            to={`/order/${order._id}`}
            className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-4 sm:mb-0">
                <div className="flex items-center mb-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Order #{order.orderNumber || order._id.substring(0, 8)}
                  </h2>
                  <span
                    className={`ml-3 px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusBadgeClass(order.status)}`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Placed on {new Date(order.orderDate).toLocaleDateString()} • {order.items?.length || 0} items
                </p>
                <p className="text-sm font-medium text-gray-900 mt-1">Total: ₹{order.totalAmount.toFixed(2)}</p>
              </div>
              <div className="flex items-center text-blue-600">
                <span className="text-sm font-medium mr-1">View Details</span>
                <ChevronRight size={16} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default OrderHistory

