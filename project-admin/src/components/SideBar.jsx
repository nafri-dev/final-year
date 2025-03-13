"use client"

import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { LayoutDashboard, ShoppingCart, Package, LogOut, ChevronLeft } from "lucide-react"

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation()
  const { logout } = useAuth()

  const isActive = (path) => {
    return location.pathname.startsWith(path)
  }

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Orders", path: "/orders", icon: <ShoppingCart size={20} /> },
    { name: "Products", path: "/products", icon: <Package size={20} /> },
  ]

  return (
    <div
      className={`${open ? "w-64" : "w-20"} transition-all duration-300 h-screen bg-white border-r border-gray-200 flex flex-col`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <div className={`${!open && "hidden"} font-bold text-xl text-gray-800`}>Admin Panel</div>
        <button onClick={() => setOpen(!open)} className="p-2 rounded-md hover:bg-gray-100">
          <ChevronLeft size={20} className={`transform transition-transform ${!open && "rotate-180"}`} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                isActive(item.path) ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span className={`${!open && "hidden"}`}>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
        >
          <LogOut size={20} className="mr-3" />
          <span className={`${!open && "hidden"}`}>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar

