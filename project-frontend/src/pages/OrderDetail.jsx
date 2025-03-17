"use client"

import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { getOrderById } from "../api/productApi"
import { useAuth } from "../context/AuthContext"
import toast from "react-hot-toast"
import { ArrowLeft, Truck, Package, CheckCircle, AlertCircle } from "lucide-react"

const OrderDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!user || !id) return

      try {
        setLoading(true)
        const response = await getOrderById(id)
        console.log(response)

        // // Verify this order belongs to the current user
        if (response.userId.email !== user.email) {
          setError("You don't have permission to view this order")
          return
        }

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
  }, [id, user])

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Package className="text-yellow-500" />
      case "processing":
        return <Package className="text-blue-500" />
      case "shipped":
        return <Truck className="text-purple-500" />
      case "delivered":
        return <CheckCircle className="text-green-500" />
      case "cancelled":
        return <AlertCircle className="text-red-500" />
      default:
        return <Package className="text-gray-500" />
    }
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-red-500 mb-6">{error}</p>
          <Link
            to="/orders"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <div className="bg-white rounded-lg shadow-md p-8 my-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-lg text-gray-600 mb-6">The order youre looking for doesnt exist or has been removed.</p>
          <Link
            to="/orders"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <Link to="/orders" className="mr-4 text-gray-500 hover:text-gray-700">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Order #{order.orderNumber || order._id.substring(0, 8)}
              </h2>
              <p className="text-sm text-gray-500">Placed on {new Date(order.orderDate).toLocaleDateString()}</p>
            </div>
            <span
              className={`mt-2 sm:mt-0 px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeClass(order.status)}`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>

          <div className="flex items-center">
            <div className="flex-shrink-0 mr-3">{getStatusIcon(order.status)}</div>
            <div>
              <p className="font-medium text-gray-900">
                {order.status === "pending" && "Your order has been received"}
                {order.status === "processing" && "Your order is being processed"}
                {order.status === "shipped" && "Your order has been shipped"}
                {order.status === "delivered" && "Your order has been delivered"}
                {order.status === "cancelled" && "Your order has been cancelled"}
              </p>
              <p className="text-sm text-gray-500">
                {order.status === "pending" && "We've received your order and are preparing it"}
                {order.status === "processing" && "We're preparing your items for shipment"}
                {order.status === "shipped" && "Your order is on its way to you"}
                {order.status === "delivered" && "Your order has been delivered successfully"}
                {order.status === "cancelled" && "Your order has been cancelled"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Items</h3>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded overflow-hidden mr-4">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=64&width=64"
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <Package size={24} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <h4 className="text-sm font-medium text-gray-900">{item.productName}</h4>
                  <div className="text-sm text-gray-500 mt-1">
                    {item.size && <span>Size: {item.size}</span>}
                    {item.size && item.color && <span> • </span>}
                    {item.color && <span>Color: {item.color}</span>}
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                    <span className="text-sm font-medium text-gray-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
          {order.shippingAddress ? (
            <div>
              <p className="text-sm text-gray-700">{order.shippingAddress.street}</p>
              <p className="text-sm text-gray-700">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              <p className="text-sm text-gray-700">{order.shippingAddress.country}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No shipping address available</p>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Payment Method</span>
            <span className="text-sm text-gray-900">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Payment Status</span>
            <span className="text-sm text-gray-900">{order.paymentStatus || "Paid"}</span>
          </div>
          {order.razorpayPaymentId && (
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-500">Transaction ID</span>
              <span className="text-sm text-gray-900">{order.razorpayPaymentId}</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between font-medium">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link to="/orders" className="text-blue-600 hover:text-blue-800 font-medium">
          Back to My Orders
        </Link>
      </div>
    </div>
  )
}

export default OrderDetail

