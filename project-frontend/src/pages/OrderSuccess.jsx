import { Link } from "react-router-dom"
import { CheckCircle } from "lucide-react"

const OrderSuccess = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 text-center">
      <div className="bg-white rounded-lg shadow-md p-8 my-8">
        <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>

        <p className="text-lg text-gray-600 mb-6">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>

        <p className="text-md text-gray-500 mb-8">
          You will receive an email confirmation shortly with your order details.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/orders"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            View My Orders
          </Link>

          <Link to="/" className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess

