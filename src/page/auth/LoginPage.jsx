import { useState } from "react";
import { request } from "../../util/api";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Email is required.";
    if (!form.password) newErrors.password = "Password is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await request("login", "post", form);

      if (res && res.message === "Login successful!") {
        localStorage.setItem("user", JSON.stringify(res.user));
        navigate("/");
      } else {
        setServerError("Invalid email or password.");
      }
    }  catch (error) {
      if (error.response && error.response.data) {
        const apiErrors = error.response.data.errors || {};
        setErrors(apiErrors);
        setServerError(error.response.data.message || "Registration failed.");
      } else {
        setServerError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-2">

      {/* Left Panel - Form */}
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">

          <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

          {serverError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className={`w-full border focus:outline-none p-3 rounded ${
                  errors.email ? "border-red-500" : "border-gray-300 focus:border-red-500"
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="mb-6">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className={`w-full border focus:outline-none p-3 rounded ${
                  errors.password ? "border-red-500" : "border-gray-300 focus:border-red-500"
                }`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white p-3 rounded transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            Don't have an account?{" "}
            <a href="/register" className="text-red-600 font-semibold hover:underline">
              Register
            </a>
          </p>

        </div>
      </div>

      {/* Right Panel */}
      <div className="items-center flex bg-red-600 p-10">
        <div className="text-white">
          <h1 className="text-4xl font-bold font-serif">
            LoginNow
          </h1>
          <h1 className="text-4xl font-bold mb-6 mt-6 font-serif">
            Manage Your Products Easily
          </h1>
          <p className="text-white mt-4">
            Organize products efficiently.
            Create powerful brands.
            Structure smart categories.
            Track inventory.
            Control pricing.
            Build a scalable system.
          </p>
          <div className="mt-8 flex gap-3 font-serif">
            <span className="px-3 py-1 bg-white text-red-600 rounded-full">Category</span>
            <span className="px-3 py-1 bg-white text-red-600 rounded-full">Product</span>
            <span className="px-3 py-1 bg-white text-red-600 rounded-full">Brand</span>
            <span className="px-3 py-1 bg-white text-red-600 rounded-full">Inventory</span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default LoginPage;