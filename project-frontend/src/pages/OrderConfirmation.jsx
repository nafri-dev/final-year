"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { getOrderById } from "../api/productApi"

const OrderConfirmation = () => {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { orderId } = useParams()

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const fetchedOrder = await getOrderById(orderId)
        setOrder(fetchedOrder)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching order:", err)
        setError("Failed to fetch order details. Please try again.")
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (loading) return <div className="text-center py-8">Loading order details...</div>
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>
  if (!order) return <div className="text-center py-8">Order not found</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Confirmation</h1>
      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-8" role="alert">
        <p className="font-bold">Thank you for your order!</p>
        <p>Your order has been successfully placed and is being processed.</p>
      </div>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-4">Order Details</h2>
        <p>
          <strong>Order ID:</strong> {order._id}
        </p>
        <p>
          <strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}
        </p>
        <p>
          <strong>Total Amount:</strong> ₹{order.totalAmount.toFixed(2)}
        </p>
        <p>
          <strong>Status:</strong> {order.status}
        </p>
        <h3 className="text-xl font-bold mt-6 mb-2">Items</h3>
        <ul>
          {order.items.map((item, index) => (
            <li key={index} className="mb-2">
              {item.productName} - Quantity: {item.quantity}
              {item.size && `, Size: ${item.size}`}
              {item.color && `, Color: ${item.color}`}
            </li>
          ))}
        </ul>
      </div>
      <Link to="/products" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Continue Shopping
      </Link>
    </div>
  )
}

export default OrderConfirmation

