import { Outlet, useNavigate, useLocation } from "react-router-dom";
import React, { useState, createContext } from "react";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Categories", path: "/categories" },
  { label: "Brands", path: "/brands" },
  { label: "Products", path: "/products" },
  { label: "Orders", path: "/orders/history" },
];

export const AdminModeContext = createContext(false);

function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isStaff = user.role === "admin" || user.role === "staff";
  const [adminMode, setAdminMode] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AdminModeContext.Provider value={adminMode}>
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-between items-center px-10 py-4 bg-red-600 shadow-md">

          <div
            className="text-white font-extrabold text-2xl font-serif cursor-pointer"
            onClick={() => navigate("/")}
          >
            你好
          </div>

          <div className="flex gap-6 items-center">
            {navItems.map((item) => (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`cursor-pointer text-sm font-semibold transition ${
                  location.pathname === item.path
                    ? "text-white underline underline-offset-4"
                    : "text-red-200 hover:text-white"
                }`}
              >
                {item.label}
              </div>
            ))}

            {/* Admin Mode Toggle - only visible to admin/staff */}
            {isStaff && (
              <div className="flex items-center gap-2 ml-2 bg-red-700 px-3 py-1.5 rounded-full">
                <span className="text-xs text-red-200 font-semibold">
                  Admin
                </span>
                <button
                  onClick={() => setAdminMode((v) => !v)}
                  className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none ${
                    adminMode ? "bg-white" : "bg-red-400"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform duration-200 ${
                      adminMode
                        ? "translate-x-5 bg-red-600"
                        : "translate-x-0 bg-white"
                    }`}
                  />
                </button>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-1.5 bg-white text-red-600 text-sm font-semibold rounded-full hover:bg-red-50 transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div>
          <Outlet />
        </div>
      </div>
    </AdminModeContext.Provider>
  );
}

export default MainLayout;