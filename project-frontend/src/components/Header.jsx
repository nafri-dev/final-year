import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Menu, ShoppingCart, User, X, Package } from "lucide-react";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import { useState } from "react";

export default function Header() {
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 ">
        <div className="flex items-center justify-between ">
          <div className="flex items-start">
            <Link to="/" className=" flex  flex-row">
              <img src="/assets/newlogo.jpg" className="h-12 w-15 " />
              <p className="hidden lg:flex text-xl font-mono text-center justify-center align-middle mt-2">
                {" "}
                Kumari Textiles
              </p>
            </Link>

            <nav className="hidden md:flex space-x-8 xl:ml-[250px] 2xl:ml-[450px] mt-2 ">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link
                to="/products"
                className="text-gray-600 hover:text-gray-900"
              >
                Products
              </Link>
              <Link to="/Aboutus" className="text-gray-600 hover:text-gray-900">
                About Us
              </Link>
            </nav>
          </div>

          {/* Desktop Navigation */}

          <div className="flex items-center space-x-4 ">
            {user ? (
              <div className="hidden md:flex items-center space-x-4 ">
                <Tooltip id="user-tooltip" />
                <a
                  data-tooltip-id="user-tooltip"
                  data-tooltip-content={user.email}
                  data-tooltip-place="left"
                >
                  <User size={24} className="text-gray-600 " />
                </a>
                <button
                  onClick={logout}
                  className="text-primary hover:text-primary-dark"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-gray-900">
                  Login
                </Link>
                <span className="text-gray-300">/</span>
                <Link
                  to="/register"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Register
                </Link>
              </div>
            )}

            <Link to="/cart" className="relative">
              <ShoppingCart size={24} className="text-gray-600" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              to="/orders"
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              <Package size={20} />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="mt-4 md:hidden">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 py-2"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-gray-600 hover:text-gray-900 py-2"
                onClick={toggleMenu}
              >
                Products
              </Link>
              <Link
                to="/Aboutus"
                className="text-gray-600 hover:text-gray-900 py-2"
                onClick={toggleMenu}
              >
                About Us
              </Link>
              {!user && (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900 py-2"
                    onClick={toggleMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-gray-600 hover:text-gray-900 py-2"
                    onClick={toggleMenu}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
