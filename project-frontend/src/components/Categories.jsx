/* eslint-disable react/prop-types */
"use client"

import { useState, useEffect } from "react"
import { getCategories } from "../api/productApi"
import { motion } from "framer-motion"
import { Layers, ShoppingBag, Loader } from "lucide-react"

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching categories:", err)
        setError("Failed to fetch categories. Please try again later.")
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  console.log(categories)

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-purple-50 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-50 rounded-full -mb-32 -mr-32 opacity-70"></div>
      <div className="absolute top-1/4 left-1/4 w-6 h-6 bg-purple-200 rounded-full"></div>
      <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-yellow-200 rounded-full"></div>
      <div className="absolute bottom-1/4 left-1/3 w-8 h-8 bg-blue-100 rounded-full"></div>

      <div className="container mx-auto px-4 relative">
        {/* Section header */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Layers size={28} className="text-purple-600" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Shop by Category</h2>
          <p className="text-gray-600">
            Browse our wide selection of products organized by category to find exactly what youre looking for.
          </p>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader size={40} className="text-purple-500 animate-spin mb-4" />
            <p className="text-gray-500">Loading categories...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md max-w-lg mx-auto">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No categories found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

const CategoryCard = ({ category, index }) => {
  // Animation variants for staggered appearance
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1, // Stagger effect
      },
    },
  }

  // Array of background colors to cycle through
  const bgColors = [
    "bg-purple-50 hover:bg-purple-100",
    "bg-blue-50 hover:bg-blue-100",
    "bg-green-50 hover:bg-green-100",
    "bg-yellow-50 hover:bg-yellow-100",
    "bg-pink-50 hover:bg-pink-100",
    "bg-indigo-50 hover:bg-indigo-100",
  ]

  // Array of accent colors to match backgrounds
  const accentColors = [
    "text-purple-600 group-hover:text-purple-700",
    "text-blue-600 group-hover:text-blue-700",
    "text-green-600 group-hover:text-green-700",
    "text-yellow-600 group-hover:text-yellow-700",
    "text-pink-600 group-hover:text-pink-700",
    "text-indigo-600 group-hover:text-indigo-700",
  ]

  // Get color based on index
  const bgColor = bgColors[index % bgColors.length]
  const accentColor = accentColors[index % accentColors.length]

  return (
    <motion.div initial="hidden" animate="visible" variants={cardVariants}>
      <a
        href={`/category/${category.id}`}
        className={`group block rounded-xl overflow-hidden ${bgColor} transition-all duration-300 hover:shadow-md`}
      >
        <div className="p-6 flex flex-col items-center text-center">
          <div className="mb-4 relative">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
              <img
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                className="w-10 h-10 md:w-12 md:h-12 object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
              <ShoppingBag size={12} className={accentColor} />
            </div>
          </div>

          <h3 className={`font-medium ${accentColor} transition-colors`}>{category.name}</h3>

          <div className="mt-3 w-8 h-1 rounded-full bg-gray-200 group-hover:bg-white transition-colors"></div>
        </div>
      </a>
    </motion.div>
  )
}

export default Categories

