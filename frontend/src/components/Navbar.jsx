import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu } from "lucide-react";
import toast from "react-hot-toast";

const Navbar = () => {
  const { navigate, user, setUser, cartCount } = useContext(AppContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="bg-cyan-50 shadow-md sticky top-0 z-50 py-3">
      <div className="max-w-7xl mx-auto px-4">

        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            <img src="/logo.png" alt="logo" className="w-20" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 font-medium">
            <Link to="/">Home</Link>
            <Link to="/menu">Menus</Link>
            <Link to="/book-table">Book Table</Link>
            <Link to="/contact">Contact</Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">

            {/* Cart */}
            <button onClick={() => navigate("/cart")} className="relative">
              <ShoppingCart />
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full px-1">
                {cartCount || 0}
              </span>
            </button>

            {/* Desktop Login/Profile */}
            <div className="hidden md:block">
              {user ? (
                <button onClick={logout} className="text-red-600 font-medium">
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="bg-orange-500 text-white px-4 py-2 rounded"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden flex flex-col gap-3 mt-4 font-medium">

            <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/menu" onClick={() => setIsMenuOpen(false)}>Menus</Link>
            <Link to="/book-table" onClick={() => setIsMenuOpen(false)}>
              Book Table
            </Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>

            {user ? (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
                className="text-red-600 font-medium"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/login");
                }}
                className="bg-orange-500 text-white px-4 py-2 rounded"
              >
                Login
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
