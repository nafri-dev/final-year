/* eslint-disable no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { getProductsByCategory } from "../api/productApi"
import { Link } from "react-router-dom"
import { ArrowRight, Star } from "lucide-react"

const Sarees = () => {
  const [sarees, setSarees] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSarees = async () => {
      try {
        // Assuming category ID 2 is for sarees
        const data = await getProductsByCategory(2)
        setSarees(data.slice(0, 8)) // Get 6 items for our bento grid
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching sarees:", err)
        setError("Failed to fetch sarees. Please try again later.")
        setIsLoading(false)
      }
    }

    fetchSarees()
  }, [])

  if (isLoading)
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 w-full max-w-3xl bg-gray-200 rounded"></div>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center py-4 text-red-500 bg-red-50 px-6 rounded-lg shadow-sm">{error}</div>
      </div>
    )

  // If we don't have enough sarees, add placeholders
  const displaySarees =
    sarees.length >= 6
      ? sarees
      : [
          ...sarees,
          ...Array(6 - sarees.length)
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
    <section className="py-16 px-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-100 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-100 rounded-full translate-x-1/3 translate-y-1/3 opacity-30"></div>

      <div className="container mx-auto relative">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="text-gray-800">Trending</span> <span className="text-yellow-500">Sarees</span>
          </h2>
          <Link
            to="/products"
            className="group flex items-center text-sm font-medium text-gray-600 hover:text-yellow-500 transition-colors"
          >
            View All
            <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {sarees.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No sarees found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-fr bento-grid">
            {/* Featured saree (2x2) */}
            <div className="col-span-1 md:col-span-2 row-span-1  md:row-span-2 rounded-2xl overflow-hidden group">
              <Link to={`/product/${displaySarees[0].customId}`} className="block h-full">
                <div className="relative h-full bg-gradient-to-br from-yellow-50 to-pink-50 p-4">
                  <div
                    className="absolute inset-0 bg-contain bg-center p-25"
                    style={{ backgroundImage: `url(${displaySarees[0].imageUrl})`, opacity: 0.9 }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-yellow-50 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-black z-10">
                    <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-yellow-300 transition-colors">
                      {displaySarees[0].name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-sm opacity-90">Best Seller</span>
                    </div>
                    <p className="text-lg md:text-xl font-bold">₹{displaySarees[0].price}</p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 text-black px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </div>
                </div>
              </Link>
            </div>

            {/* Regular sarees (1x1) */}
            {displaySarees.slice(1,8).map((saree, index) => (
              <div
                key={saree.customId}
                className={`col-span-1 row-span-1 rounded-xl overflow-hidden group ${saree.isPlaceholder ? "opacity-60" : ""}`}
              >
                <Link
                  to={saree.isPlaceholder ? "#" : `/product/${saree.customId}`}
                  className={`block h-full ${saree.isPlaceholder ? "cursor-default" : ""}`}
                >
                  <div className="relative h-full bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={saree.imageUrl || "/placeholder.svg"}
                        alt={saree.name}
                        className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 truncate group-hover:text-yellow-600 transition-colors">
                        {saree.name}
                      </h3>
                      <div className="mt-2 flex justify-between items-center">
                        <p className="font-bold text-gray-900">{saree.isPlaceholder ? "" : `₹${saree.price}`}</p>
                        {!saree.isPlaceholder && (
                          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                            New Arrival
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Sarees

