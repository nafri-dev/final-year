"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { orderService } from "../services/api"
import { ArrowLeft } from "lucide-react"
import toast from "react-hot-toast"

const OrderDetails = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true)
        console.log("Fetching order with ID:", id)
        const response = await orderService.getOrderById(id)
        console.log("Order details received:", response)
        setOrder(response)
        setError(null)
      } catch (error) {
        console.error("Error fetching order details:", error)
        setError("Failed to load order details. Please try again.")
        toast.error("Failed to load order details")
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [id])

  const updateOrderStatus = async (newStatus) => {
    setUpdatingStatus(true)
    try {
      await orderService.updateOrderStatus(id, newStatus)

      setOrder((prev) => (prev ? { ...prev, status: newStatus } : null))
      toast.success("Order status updated successfully")
    } catch (error) {
      console.error("Error updating order status:", error)
      toast.error("Failed to update order status")
    } finally {
      setUpdatingStatus(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Order</h2>
        <p className="text-red-500 mb-4">{error}</p>
        <Link to="/orders" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
          Back to Orders
        </Link>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900">Order not found</h2>
        <Link to="/orders" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
          Back to Orders
        </Link>
      </div>
    )
  }

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

  // Calculate item price if not available
  const getItemPrice = (item) => {
    // If price is directly available in the item
    if (item.price !== undefined && item.price !== null) {
      return item.price
    }

    // If price is not available in the item, calculate from total and quantity
    if (item.total && item.quantity) {
      return item.total / item.quantity
    }

    // Fallback to 0 if no price information is available
    return 0
  }

  // Calculate item total
  const getItemTotal = (item) => {
    if (item.total) return item.total

    const price = getItemPrice(item)
    return price * item.quantity
  }

  // Safely access user data
  const userEmail = order.userId?.email || "N/A"
  const userName = order.userId?.username || "N/A"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/orders" className="mr-4 text-gray-500 hover:text-gray-700">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber || order._id}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeClass(order.status)}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
          <select
            className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={order.status}
            onChange={(e) => updateOrderStatus(e.target.value)}
            disabled={updatingStatus}
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Product
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {item.productName || `Product #${item.productId}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.size && `Size: ${item.size}`}
                            {item.size && item.color && ", "}
                            {item.color && `Color: ${item.color}`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{getItemPrice(item).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{getItemTotal(item).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        Total:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{order.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Customer Information</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-700 mb-1">
                <span className="font-medium">Name:</span> {userName}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Email:</span> {userEmail}
              </p>
            </div>
          </div>

          {order.shippingAddress && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Shipping Address</h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-700">{order.shippingAddress.street}</p>
                <p className="text-sm text-gray-700">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </p>
                <p className="text-sm text-gray-700">{order.shippingAddress.country}</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Order Information</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-700 mb-1">
                <span className="font-medium">Order ID:</span> {order.orderNumber || order._id}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <span className="font-medium">Date:</span> {new Date(order.orderDate).toLocaleString()}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <span className="font-medium">Status:</span>{" "}
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Total Amount:</span> ₹{order.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails

