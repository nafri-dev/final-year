/* eslint-disable react/prop-types */
import { Link } from "react-router-dom"
import { Heart, ShoppingBag } from "lucide-react"

const Card = ({ product, listView = false }) => {
  if (!product) return null

  if (listView) {
    return (
      <div className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow transition-shadow duration-300">
        <Link to={`/product/${product.customId}`} className="flex">
          <div className="w-1/3 p-4 flex items-center justify-center bg-gray-50">
            <img
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              className="h-32 w-auto object-contain group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="w-2/3 p-4 flex flex-col justify-between">
            <div>
              <h3 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                {product.description || "High-quality product with premium materials and excellent craftsmanship."}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <p className="font-bold text-gray-900">₹{product.price}</p>
                {product.originalPrice && (
                  <p className="text-sm text-red-500 line-through ml-2">₹{product.originalPrice}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <button className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  <Heart size={16} className="text-gray-600" />
                </button>
                <button className="p-1.5 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors">
                  <ShoppingBag size={16} className="text-blue-600" />
                </button>
              </div>
            </div>
          </div>
        </Link>
      </div>
    )
  }

  return (
    <div className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow transition-shadow duration-300">
      <Link to={`/product/${product.customId}`} className="block">
        <div className="relative p-4 bg-gray-50">
          <img
            src={product.imageUrl || "/placeholder.svg"}
            alt={product.name}
            className="h-40 w-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Heart size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
            {product.name}
          </h3>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <p className="font-bold text-gray-900">₹{product.price}</p>
              {product.originalPrice && (
                <p className="text-sm text-red-500 line-through ml-2">₹{product.originalPrice}</p>
              )}
            </div>
            <button className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors">
              <ShoppingBag size={16} className="text-blue-600" />
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default Card

