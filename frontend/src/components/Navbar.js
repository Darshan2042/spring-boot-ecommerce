import React, { useMemo, useCallback } from "react";
import { useAppContext } from "../context/AppContext";

const Navbar = ({ currentPage, setCurrentPage }) => {
  const { cart, currentUser, logout } = useAppContext();

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item?.quantity || 0), 0);
  }, [cart]);

  const isAdmin = useMemo(() => {
    if (!currentUser?.roles) return false;
    return currentUser.roles.some(
      (role) => role === "ROLE_ADMIN" || role.name === "ROLE_ADMIN"
    );
  }, [currentUser]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">

        {/* LOGO */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setCurrentPage("home")}
        >
          <span>🛒</span>
          <h1 className="text-lg font-semibold text-black">ShopHub</h1>
        </div>

        {/* MENU */}
        <div className="flex items-center gap-3">

          {/* HOME */}
          <button
            onClick={() => setCurrentPage("home")}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              currentPage === "home"
                ? "bg-[#BFD7E3] text-black shadow-sm"
                : "text-gray-700 bg-white hover:shadow-md"
            }`}
          >
            Home
          </button>

          {/* PRODUCTS */}
          {currentUser && !isAdmin && (
            <button
              onClick={() => setCurrentPage("products")}
              className={`px-4 py-2 rounded-lg text-sm transition ${
                currentPage === "products"
                  ? "bg-[#BFD7E3] text-black shadow-sm"
                  : "text-gray-700 bg-white hover:shadow-md"
              }`}
            >
              Products
            </button>
          )}

          {/* CART */}
          {currentUser && !isAdmin && (
            <button
              onClick={() => setCurrentPage("cart")}
              className={`relative px-4 py-2 rounded-lg text-sm transition ${
                currentPage === "cart"
                  ? "bg-[#BFD7E3] text-black shadow-sm"
                  : "text-gray-700 bg-white hover:shadow-md"
              }`}
            >
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* ORDERS */}
          {currentUser && !isAdmin && (
            <button
              onClick={() => setCurrentPage("orders")}
              className={`px-4 py-2 rounded-lg text-sm transition ${
                currentPage === "orders"
                  ? "bg-[#BFD7E3] text-black shadow-sm"
                  : "text-gray-700 bg-white hover:shadow-md"
              }`}
            >
              Orders
            </button>
          )}

          {/* ADMIN */}
          {isAdmin && (
            <button
              onClick={() => setCurrentPage("admin")}
              className={`px-4 py-2 rounded-lg text-sm transition ${
                currentPage === "admin"
                  ? "bg-[#BFD7E3] text-black shadow-sm"
                  : "text-gray-700 bg-white hover:shadow-md"
              }`}
            >
              Admin
            </button>
          )}

          {/* RIGHT SIDE */}
          {currentUser ? (
            <div className="flex items-center gap-3 ml-4 border-l pl-4 border-gray-200">
              <span className="text-sm text-black">{currentUser.username}</span>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:shadow-md text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 ml-4 border-l pl-4 border-gray-200">

              <button
                onClick={() => setCurrentPage("customerLogin")}
                className="px-4 py-2 bg-[#BFD7E3] rounded-lg text-black hover:shadow-md text-sm"
              >
                Login
              </button>

              <button
                onClick={() => setCurrentPage("adminLogin")}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:shadow-md text-sm"
              >
                Admin
              </button>

            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default React.memo(Navbar);