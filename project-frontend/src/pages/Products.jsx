// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { getAllProducts } from '../api/productApi';
// import Header from '../components/Header';

// export default function Products() {
//   const [products, setProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const data = await getAllProducts();
//         console.log('Fetched Products:', data); // Log full API response

//         setProducts(data);
//         setFilteredProducts(data);
//         setIsLoading(false);
//       } catch (err) {
//         setError('Failed to fetch products. Please try again later.');
//         setIsLoading(false);
//         console.log(err)
//       }
//     };

//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     const results = products.filter(product =>
//       product.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredProducts(results);
//   }, [searchTerm, products]);

//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;


//   return (
//     <>
//       <Header />
//       <div className="container mx-auto my-8 px-4">
//         <h1 className="text-3xl font-bold text-center mb-8">All Products</h1>
        
//         <div className="mb-8">
//           <input
//             type="text"
//             placeholder="Search products..."
//             value={searchTerm}
//             onChange={handleSearch}
//             className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//           />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {filteredProducts.map((product) => (
//             <div key={product.customId} className="block">
//               <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
//                 <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-contain mb-4" />
              


//                 <h2 className="text-lg font-semibold truncate mb-2">{product.name}</h2>
//                 <div className='flex gap-2 mb-6'> 
//                   <p className="text-black font-bold">₹{product.price}</p>
//                   <p className="text-sm text-red-500 line-through">₹{product.originalPrice}</p>
//                   <p className="text-sm text-green-500">{product.discount}</p>
//                 </div>
//                 <div className='flex justify-center'>
//                 <Link to={`/product/${product.customId}`} className='text-center bg-yellow-400 text-black rounded-lg px-10 py-1 align-middle hover:bg-yellow-500 transition-colors duration-300'>View Product</Link>
//               </div>
//               </div>


//             </div>
             
//           ))}
//         </div>

      
//         <div>
//         {/* {filteredProducts.map((product) => (
//             <div key={product.id} className="block">
//                  <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
//                  <Link to={`/product/${product.id}`} className='text-center bg-yellow-400 text-black rounded-lg px-10 py-1 ml-14 hover:bg-yellow-500 transition-colors duration-300'>View Product</Link>
//             </div>))
// } */}
// </div>
      

//         {filteredProducts.length === 0 && (
//           <p className="text-center text-gray-500 mt-8">No products found matching your search.</p>
//         )}
//       </div>
//     </>
//   );
// }



import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getAllProducts, getCategories } from "../api/productApi"
import Header from "../components/Header"
import { Filter, X } from "lucide-react"

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([getAllProducts(), getCategories()])

        console.log("Fetched Products:", productsData)
        console.log("Fetched Categories:", categoriesData)

        setProducts(productsData)
        setFilteredProducts(productsData)
        setCategories(categoriesData)
        setIsLoading(false)
      } catch (err) {
        setError("Failed to fetch data. Please try again later.")
        setIsLoading(false)
        console.log(err)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    let results = products

    // Filter by search term
    if (searchTerm) {
      results = results.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      results = results.filter((product) => selectedCategories.includes(product.category))
    }

    setFilteredProducts(results)
  }, [searchTerm, selectedCategories, products])

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategories([])
  }

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isFilterOpen && !event.target.closest(".filter-dropdown") && !event.target.closest(".filter-button")) {
        setIsFilterOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isFilterOpen])

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>

  return (
    <>
      <Header />
      <div className="container mx-auto my-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">All Products</h1>

        <div className="mb-8 flex items-center gap-2 relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <button
            onClick={toggleFilter}
            className="filter-button bg-yellow-400 text-black p-2 rounded-lg hover:bg-yellow-500 transition-colors"
            aria-label="Filter products"
          >
            <Filter size={20} />
          </button>

          {/* Filter Dropdown */}
          {isFilterOpen && (
            <div className="filter-dropdown absolute right-0 top-12 z-10 bg-white shadow-lg rounded-lg p-4 border border-gray-200 w-64">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Filter Products</h3>
                <button onClick={toggleFilter} className="text-gray-500">
                  <X size={18} />
                </button>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2 text-sm">Categories</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => handleCategoryChange(category.id)}
                        className="mr-2 h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-300 rounded"
                      />
                      <label htmlFor={`category-${category.id}`} className="text-sm">
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  {selectedCategories.length} {selectedCategories.length === 1 ? "filter" : "filters"} applied
                </span>
                {selectedCategories.length > 0 && (
                  <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline">
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Applied Filters Display */}
          {selectedCategories.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-500">Filters:</span>
              {selectedCategories.map((categoryId) => {
                const category = categories.find((c) => c.id === categoryId)
                return category ? (
                  <span key={categoryId} className="bg-gray-100 text-sm px-2 py-1 rounded-full flex items-center">
                    {category.name}
                    <button
                      onClick={() => handleCategoryChange(categoryId)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ) : null
              })}
              <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline ml-2">
                Clear all
              </button>
            </div>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">No products found matching your filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.customId} className="block">
                <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <img
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-contain mb-4"
                  />
                  <h2 className="text-lg font-semibold truncate mb-2">{product.name}</h2>
                  <div className="flex gap-2 mb-6">
                    <p className="text-black font-bold">₹{product.price}</p>
                    {product.originalPrice && (
                      <p className="text-sm text-red-500 line-through">₹{product.originalPrice}</p>
                    )}
                    {product.discount && <p className="text-sm text-green-500">{product.discount}</p>}
                  </div>
                  <div className="flex justify-center">
                    <Link
                      to={`/product/${product.customId}`}
                      className="text-center bg-yellow-400 text-black rounded-lg px-10 py-1 align-middle hover:bg-yellow-500 transition-colors duration-300"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}



