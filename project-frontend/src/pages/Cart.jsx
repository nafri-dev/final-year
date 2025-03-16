import { useState , useEffect} from "react";
import { useCart } from "../context/CartContext"
import { Link } from "react-router-dom"



import CheckoutForm from "../components/CheckoutForm"


const Cart = () => {
  const { cart, removeFromCart, updateQuantity,refreshCart } = useCart()
  

  const [isCheckout, setIsCheckout] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  useEffect(() => {
    refreshCart()
  }, []);

 
  if (cart.length === 0) {
    return (
      <div className="container mx-auto my-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <Link to="/products" className="text-blue-600 hover:underline">
          Continue Shopping
        </Link>
      </div>
    )
  }
  if (isCheckout) {
    
    return (
      
    <CheckoutForm />
   
      
  )
    
  }

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {cart.map((item) => (
            <div key={item._id} className="flex items-center border-b py-4">
              <img
                src={item.imageUrl || "/placeholder.svg"}
                alt={item.productName}
                className="w-24 h-24 object-contain mr-4"
              />
              <div className="flex-grow">
                <h2 className="text-lg font-semibold">{item.productName}</h2>
                <p className="text-gray-600">₹{item.price.toFixed(2)}</p>
                <p className="text-sm">Size: {item.size}</p>
                <p className="text-sm">Color: {item.color}</p>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                    className="bg-gray-200 px-2 py-1 rounded"
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="bg-gray-200 px-2 py-1 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
              <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700">
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          {cart.map((item) => (
            <div key={item._id} className="flex justify-between mb-2">
              <span>
                {item.productName} x {item.quantity}
              </span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
          <button
           onClick={() => setIsCheckout(true)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg mt-6 hover:bg-blue-700 transition-colors"
          >
          Proceed to checkout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart

