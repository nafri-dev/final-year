/* eslint-disable react/prop-types */
"use client"

import { useState, useEffect } from "react"
import { getProductsByCategory } from "../api/productApi"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

const Pants = () => {
  const [pants, setPants] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPants = async () => {
      try {
        // Assuming category ID 6 is for pants
        const data = await getProductsByCategory(6)
        setPants(data.slice(0, 5))
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching pants:", err)
        setError("Failed to fetch pants. Please try again later.")
        setIsLoading(false)
      }
    }

    fetchPants()
  }, [])

  // If we don't have enough pants, add placeholders
  const displayPants = isLoading
    ? Array(5).fill({ isPlaceholder: true })
    : pants.length >= 5
      ? pants
      : [
          ...pants,
          ...Array(5 - pants.length)
            .fill(null)
            .map((_, i) => ({
              customId: `placeholder-${i}`,
              name: "Coming Soon",
              price: 0,
              imageUrl: "/placeholder.svg",
              isPlaceholder: true,
            })),
        ]

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100"></div>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-green-50 to-transparent opacity-70"></div>

      <div className="container mx-auto px-4 relative">
        {/* Section header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="relative mb-6 md:mb-0">
          
            <h2 className="text-4xl md:text-5xl font-bold relative z-10">
              <span className="text-gray-800">Premium</span> <span className="text-green-600">Pants</span>
            </h2>
            <p className="text-gray-600 mt-3 max-w-xl">
              Elevate your style with our collection of comfortable and trendy pants.
            </p>
          </div>
          <Link
            to="/products"
            className="group flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            View All Pants
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="animate-pulse bg-white rounded-lg overflow-hidden shadow-sm h-80">
                  <div className="bg-gray-200 h-48 w-full"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        ) : pants.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No pants found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {displayPants.map((pant, index) => (
              <PantCard key={pant.customId || index} pant={pant} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

const PantCard = ({ pant }) => {
  const isPlaceholder = pant.isPlaceholder

  return (
    <div
      className={`group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ${isPlaceholder ? "opacity-60" : ""}`}
    >
      <Link
        to={isPlaceholder ? "#" : `/product/${pant.customId}`}
        className={`block ${isPlaceholder ? "pointer-events-none" : ""}`}
      >
        <div className="relative h-56 overflow-hidden">
          <img
            src={pant.imageUrl || "/placeholder.svg"}
            alt={pant.name}
            className={`w-full h-full object-cover object-center transition-transform duration-700 ${
              isPlaceholder ? "" : "group-hover:scale-105"
            }`}
          />

          {!isPlaceholder && (
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          )}

          {!isPlaceholder && (
            <div className="absolute top-0 left-0 w-full p-3 flex justify-between items-center">
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                New Arrival
              </span>

              {pant.discount && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                  {pant.discount}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-medium text-gray-800 mb-2 group-hover:text-green-600 transition-colors line-clamp-1">
            {pant.name}
          </h3>

          {!isPlaceholder ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900">₹{pant.price}</p>
                {pant.originalPrice && <p className="text-sm text-red-500 line-through">₹{pant.originalPrice}</p>}
              </div>

              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <ArrowRight size={16} className="text-gray-600 group-hover:text-green-600 transition-colors" />
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">Coming soon</p>
          )}
        </div>
      </Link>
    </div>
  )
}

export default Pants

