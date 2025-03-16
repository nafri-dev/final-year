/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  getCartByUser,
  saveAddress,
  getUserAddress,
  createRazorpayOrder,
  verifyRazorpayPayment,
  placeOrder,
  clearCart,
} from "../api/productApi"
import { useAuth } from "../context/AuthContext"
import toast from "react-hot-toast"

const CheckoutForm = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  })
  const [savedAddress, setSavedAddress] = useState(null)
  const [useNewAddress, setUseNewAddress] = useState(false)

  useEffect(() => {
    if (!user) {
      // navigate("/login")
      console.log("user not logged in")
      return
    }

    fetchCartItems()
  }, [user])

  useEffect(() => {
    if (user && user.id) {
      fetchUserAddress()
    }
  }, [user])

  const fetchCartItems = async () => {
    try {
      setLoading(true)
      const items = await getCartByUser(user.id)
      setCartItems(items)

      // Calculate total amount
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      setTotalAmount(total)
    } catch (error) {
      console.error("Error fetching cart items:", error)
      toast.error("Failed to load cart items. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const fetchUserAddress = async () => {
    if (!user) return

    try {
      setLoading(true)
      const address = await getUserAddress(user.id)

      if (address && address._id) {
        setSavedAddress(address)
        setAddress(address)
        setUseNewAddress(false)
      } else {
        // If no valid address is returned, set to use new address
        setUseNewAddress(true)
      }
    } catch (error) {
      console.log("No saved address found or error:", error)
      setUseNewAddress(true)
    } finally {
      setLoading(false)
    }
  }

  const handleAddressChange = (e) => {
    const { name, value } = e.target
    setAddress((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddressSave = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate address fields
      if (!address.street || !address.city || !address.state || !address.postalCode || !address.country) {
        toast.error("Please fill in all address fields")
        setLoading(false)
        return
      }

      // Save the address
      const savedAddr = await saveAddress(user.id, address)

      if (savedAddr && savedAddr._id) {
        setSavedAddress(savedAddr)
        setUseNewAddress(false)
        toast.success("Address saved successfully")
      } else {
        toast.error("Failed to save address: Invalid response")
      }
    } catch (error) {
      console.error("Error saving address:", error)
      toast.error("Failed to save address: " + (error.message || "Unknown error"))
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!savedAddress) {
      toast.error("Please save your address first")
      return
    }

    setLoading(true)

    try {
      // Create Razorpay order
      const orderResponse = await createRazorpayOrder(user.id, totalAmount)
      const { orderId, amount, currency, keyId } = orderResponse

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        toast.error("Razorpay SDK failed to load. Please try again later.")
        return
      }

      // Open Razorpay checkout form
      const options = {
        key: keyId,
        amount: amount, // Amount in paise
        currency: currency,
        name: "kumari textiles",
        description: "Purchase of items",
        order_id: orderId,
        handler: async (response) => {
          // Handle successful payment
          await handleOrderCompletion(orderId, response.razorpay_payment_id, response.razorpay_signature)
        },
        prefill: {
          name: user.username || "",
          email: user.email || "",
          contact: user.phone || "",
        },
        notes: {
          address: `${address.street}, ${address.city}, ${address.state}, ${address.postalCode}, ${address.country}`,
        },
        theme: {
          color: "#3399cc",
        },
      }

      const razorpayWindow = new window.Razorpay(options)
      razorpayWindow.open()
    } catch (error) {
      console.error("Error initiating payment:", error)
      toast.error("Failed to initiate payment")
    } finally {
      setLoading(false)
    }
  }

  const handleOrderCompletion = async (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
    setLoading(true)

    try {
      console.log("Starting payment verification with:", {
        userId: user.id,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      })

      // Verify payment
      const verificationResult = await verifyRazorpayPayment(
        user.id,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      )

      console.log("Payment verification result:", verificationResult)

      console.log("Payment verified, placing order with:", {
        userId: user.id,
        totalAmount,
        razorpayOrderId,
        razorpayPaymentId,
        shippingAddressId: savedAddress._id,
      })

      // Place order
      const orderResponse = await placeOrder({
        userId: user.id,
        totalAmount,
        razorpayOrderId,
        razorpayPaymentId,
        shippingAddressId: savedAddress._id,
      })

      if (orderResponse) {
        console.log("Order placed successfully:", orderResponse)

        // Clear the cart after successful order
        try {
          await clearCart(user.id)
        } catch (error) {
          console.error("Error clearing cart:", error)
          // Continue with success flow even if cart clearing fails
        }

        toast.success("Order placed successfully!")
        // Use setTimeout to ensure the toast is visible before navigation
        
          navigate("/order-success")
        
      }
    } catch (error) {
      console.error("Error completing order:", error)
      console.error("Detailed error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      })
      toast.error("Failed to complete order: " + (error.message || "Unknown error"))
    } finally {
      setLoading(false)
    }
  }

  if (loading && cartItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (cartItems.length === 0 && !loading) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="mb-6">Looks like you havent added anything to your cart yet.</p>
        <button onClick={() => navigate("/")} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>

        {savedAddress && !useNewAddress ? (
          <div className="mb-4">
            <div className="border p-4 rounded mb-4">
              <p>{savedAddress.street}</p>
              <p>
                {savedAddress.city}, {savedAddress.state} {savedAddress.postalCode}
              </p>
              <p>{savedAddress.country}</p>
            </div>
            <button onClick={() => setUseNewAddress(true)} className="text-blue-600 hover:text-blue-800">
              Use a different address
            </button>
          </div>
        ) : (
          <form onSubmit={handleAddressSave} className="space-y-4">
            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                Street Address
              </label>
              <input
                type="text"
                id="street"
                name="street"
                value={address.street}
                onChange={handleAddressChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={address.city}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={address.state}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={address.postalCode}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={address.country}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? "Saving..." : "Save Address"}
            </button>
          </form>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="flex justify-between items-center border-b pb-4">
              <div className="flex items-center">
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900">{item.productName}</h4>
                  <p className="text-sm text-gray-500">
                    {item.size && `Size: ${item.size}`}
                    {item.size && item.color && ", "}
                    {item.color && `Color: ${item.color}`}
                  </p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}

          <div className="flex justify-between pt-4 border-t">
            <p className="text-base font-medium text-gray-900">Total</p>
            <p className="text-base font-medium text-gray-900">₹{totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading || (!savedAddress && useNewAddress)}
        className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {loading ? "Processing..." : "Proceed to Payment"}
      </button>
    </div>
  )
}

export default CheckoutForm

