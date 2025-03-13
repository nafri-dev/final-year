/* eslint-disable react/prop-types */
import { Link } from "react-router-dom"
import { ShoppingBag } from "lucide-react"

const CategoryCard = ({ id, image, name, colorIndex = 0 }) => {
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
  const bgColor = bgColors[colorIndex % bgColors.length]
  const accentColor = accentColors[colorIndex % accentColors.length]

  return (
    <Link
      to={`/category/${id}`}
      className={`group block rounded-xl overflow-hidden ${bgColor} transition-all duration-300 hover:shadow-md`}
    >
      <div className="p-6 flex flex-col items-center text-center">
        <div className="mb-4 relative">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
            <img
              src={image || "/placeholder.svg"}
              alt={name}
              className="w-10 h-10 md:w-12 md:h-12 object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <ShoppingBag size={12} className={accentColor} />
          </div>
        </div>

        <h3 className={`font-medium ${accentColor} transition-colors`}>{name}</h3>

        <div className="mt-3 w-8 h-1 rounded-full bg-gray-200 group-hover:bg-white transition-colors"></div>
      </div>
    </Link>
  )
}

export default CategoryCard

