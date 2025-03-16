"use client"

import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { getProductsByCategory } from "../api/productApi"
import { ArrowLeft, Filter, SlidersHorizontal, Grid3X3, Grid2X2 } from "lucide-react"
import Card from "../components/Card"

const CategoryPage = () => {
  const { category_id } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categoryName, setCategoryName] = useState("")
  const [gridView, setGridView] = useState("grid") // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [sortBy, setSortBy] = useState("featured")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const fetchedProducts = await getProductsByCategory(category_id)

        console.log(fetchedProducts)
        setProducts(fetchedProducts)
        // Assuming the first product has the category name
        if (fetchedProducts.length > 0 && fetchedProducts[0].category) {
          setCategoryName(fetchedProducts[0].category.name)
        }
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch products. Please try again later.")
        setLoading(false)
        console.log(err)
      }
    }

    fetchProducts()
    // Reset filters when category changes
    setPriceRange([0, 10000])
    setSortBy("featured")
  }, [category_id])

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price
      if (sortBy === "price-high") return b.price - a.price
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt)
      return 0 // featured - no specific sort
    })

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header with back button and category name */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors">
                <ArrowLeft size={20} className="text-gray-700" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-800 capitalize">{categoryName || "Products"}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setGridView("grid")}
                className={`p-2 rounded-md ${gridView === "grid" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
                aria-label="Grid view"
              >
                <Grid3X3 size={20} />
              </button>
              <button
                onClick={() => setGridView("list")}
                className={`p-2 rounded-md ${gridView === "list" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
                aria-label="List view"
              >
                <Grid2X2 size={20} />
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-md ${showFilters ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
                aria-label="Toggle filters"
              >
                <Filter size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters sidebar */}
          {showFilters && (
            <div className="md:w-1/4 bg-white p-4 rounded-lg shadow-sm">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-800">Filters</h2>
                  <button className="text-sm text-blue-600 hover:underline">Clear All</button>
                </div>

                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Price Range</h3>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number.parseInt(e.target.value), priceRange[1]])}
                      className="w-full p-2 border rounded-md"
                      placeholder="Min"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                      className="w-full p-2 border rounded-md"
                      placeholder="Max"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border rounded-md bg-white"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Products grid */}
          <div className={showFilters ? "md:w-3/4" : "w-full"}>
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                    <div className="bg-gray-200 h-40 mb-4 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <SlidersHorizontal size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 mb-2">No products found with the current filters.</p>
                <button
                  onClick={() => {
                    setPriceRange([0, 10000])
                    setSortBy("featured")
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-gray-600">{filteredProducts.length} products</p>
                  <div className="md:hidden">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="p-2 border rounded-md bg-white text-sm"
                    >
                      <option value="featured">Sort: Featured</option>
                      <option value="price-low">Sort: Price Low to High</option>
                      <option value="price-high">Sort: Price High to Low</option>
                      <option value="newest">Sort: Newest First</option>
                    </select>
                  </div>
                </div>

                <div
                  className={
                    gridView === "grid"
                      ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                      : "grid grid-cols-1 gap-4"
                  }
                >
                  {filteredProducts.map((product) => (
                    <Card key={product.id} product={product} listView={gridView === "list"} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryPage

