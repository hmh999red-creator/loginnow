import { useState } from "react";
import { useCart } from "../../store/CartContext";
import { useNavigate } from "react-router-dom";
import { request } from "../../util/api";

const BASE_URL = "http://127.0.0.1:8000/storage/";

function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [note, setNote] = useState("");

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    setPlacing(true);
    try {
      const orderData = {
        note,
        items: cartItems.map((i) => ({
          product_id: i.id,
          qty: i.cartQty,
          price: i.price,
        })),
        total: totalPrice,
      };
      const res = await request("orders", "post", orderData);
      if (res) {
        clearCart();
        navigate("/orders/history");
      }
    } catch {
      alert("Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center p-8">
        <div className="text-7xl mb-6">🛒</div>
        <h2 className="text-gray-800 text-3xl font-black mb-3">Your cart is empty</h2>
        <p className="text-gray-400 mb-8">Add some products before checking out.</p>
        <button onClick={() => navigate("/products")}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition">
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-5xl mx-auto">

        {/* Back */}
        <button onClick={() => navigate("/products")}
          className="text-gray-400 hover:text-red-600 text-sm mb-10 flex items-center gap-2 transition group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Back to Products
        </button>

        {/* Title */}
        <div className="mb-10">
          <p className="text-red-500 text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-6 h-px bg-red-500 inline-block" /> Checkout
          </p>
          <h1 className="text-gray-900 text-4xl font-black">Review your order</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Order Items */}
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-5">
              {cartItems.length} Item{cartItems.length > 1 ? "s" : ""}
            </p>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id}
                  className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                  {item.image && (
                    <img src={BASE_URL + item.image} alt={item.product_name}
                      className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 font-bold truncate">{item.product_name}</p>
                    <p className="text-gray-400 text-xs mt-1">{item.brand?.name} · {item.category?.name}</p>
                    <p className="text-gray-500 text-sm mt-2">
                      {item.cartQty} × <span className="text-red-500 font-bold">${parseFloat(item.price).toLocaleString()}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-800 font-black">
                      ${(parseFloat(item.price) * item.cartQty).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-5">Order Summary</p>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">

              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-500 truncate max-w-[60%]">{item.product_name} × {item.cartQty}</span>
                  <span className="text-gray-700 font-medium">
                    ${(parseFloat(item.price) * item.cartQty).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              ))}

              <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <span className="text-gray-800 font-bold text-lg">Total</span>
                <span className="text-red-600 font-black text-2xl">
                  ${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div>
                <label className="text-gray-400 text-xs uppercase tracking-widest block mb-2">Note (optional)</label>
                <textarea value={note} onChange={(e) => setNote(e.target.value)}
                  placeholder="Any special instructions..."
                  className="w-full bg-gray-50 border border-gray-200 focus:border-red-500 focus:outline-none text-gray-700 p-3 rounded-xl text-sm resize-none"
                  rows={3} />
              </div>

              <button onClick={handlePlaceOrder} disabled={placing}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white py-4 rounded-xl font-black text-lg transition">
                {placing ? "Placing Order..." : "Place Order →"}
              </button>

              <button onClick={() => navigate("/products")}
                className="w-full text-center text-gray-400 hover:text-red-500 text-sm transition">
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;