/* eslint-disable react/prop-types */
"use client"

import { useState, useEffect, useRef } from "react"
import { getProductsByCategory } from "../api/productApi"
import { Link } from "react-router-dom"
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingBag, Heart } from "lucide-react"

const LatestTees = () => {
  const [tees, setTees] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    const fetchTees = async () => {
      try {
        const data = await getProductsByCategory(1)
        setTees(data.slice(0, 8)) // Fetch more for a better display
        setIsLoading(false)
      } catch (err) {
        setError("Failed to fetch t-shirts. Please try again later.")
        setIsLoading(false)
        console.log(err)
      }
    }

    fetchTees()
  }, [])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  // If we don't have enough tees, add placeholders
  const displayTees = isLoading
    ? Array(8).fill({ isPlaceholder: true })
    : tees.length >= 5
      ? tees
      : [
          ...tees,
          ...Array(5 - tees.length)
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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <span className="inline-block px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-3">
              New Collection
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Latest T-Shirts</h2>
          </div>
          <Link to="/products" className="group flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <span className="mr-2 font-medium">View All</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <ArrowRight size={16} />
            </div>
          </Link>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array(8)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="animate-pulse bg-gray-100 rounded-lg h-80">
                  <div className="bg-gray-200 h-56 w-full rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <>
            {/* Mobile scroll controls */}
            <div className="md:hidden flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-700">Popular Picks</h3>
              <div className="flex space-x-2">
                <button
                  onClick={scrollLeft}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={scrollRight}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Scroll right"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Mobile: Horizontal Scrollable List */}
            <div className="md:hidden relative mb-8">
              <div
                ref={scrollContainerRef}
                className="flex space-x-4 overflow-x-auto pb-4 hide-scrollbar"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {displayTees.map((tee, index) => (
                  <div key={tee.customId || index} className="flex-shrink-0 w-44">
                    <TeeCard tee={tee} isLoading={isLoading} />
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: Grid Layout */}
            <div className="hidden md:block">
              <div className="grid grid-cols-4 gap-6">
                {displayTees.slice(0, 8).map((tee, index) => (
                  <TeeCard key={tee.customId || index} tee={tee} isLoading={isLoading} featured={index === 0} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

// Separate card component for reusability
const TeeCard = ({ tee, isLoading }) => {
  if (isLoading) {
    return (
      <div className="rounded-lg overflow-hidden animate-pulse h-80">
        <div className="bg-gray-200 h-full w-full"></div>
      </div>
    )
  }

  const isPlaceholder = tee.isPlaceholder

  return (
    <div className="group">
      <Link
        to={isPlaceholder ? "#" : `/product/${tee.customId}`}
        className={`block ${isPlaceholder ? "pointer-events-none" : ""}`}
      >
        <div className="relative rounded-lg overflow-hidden bg-gray-50">
          {/* Product Image */}
          <div className="h-56 overflow-hidden">
            <img
              src={tee.imageUrl || "/placeholder.svg"}
              alt={tee.name}
              className={`w-full h-full object-contain object-center transition-transform duration-500 ${
                isPlaceholder ? "opacity-40" : "group-hover:scale-105"
              }`}
            />
          </div>

          {/* Quick action buttons */}
          {!isPlaceholder && (
            <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-blue-50 transition-colors">
                <Heart size={16} className="text-gray-600" />
              </button>
              <button className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-blue-50 transition-colors">
                <ShoppingBag size={16} className="text-gray-600" />
              </button>
            </div>
          )}

          {/* New tag */}
          {!isPlaceholder && (
            <div className="absolute top-3 left-3">
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">New</span>
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="pt-4">
          <h3 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
            {tee.name}
          </h3>

          <div className="mt-2 flex justify-between items-center">
            {!isPlaceholder ? (
              <div className="flex items-center">
                <p className="font-bold text-gray-900">₹{tee.price}</p>
                {tee.originalPrice && <p className="text-sm text-red-500 line-through ml-2">₹{tee.originalPrice}</p>}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">Coming soon</p>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default LatestTees

