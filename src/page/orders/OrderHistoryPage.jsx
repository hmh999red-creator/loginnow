import { useEffect, useState } from "react";
import { request } from "../../util/api";
import { useNavigate } from "react-router-dom";

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const res = await request("orders", "get");
      if (res) setOrders(res.data || res || []);
      setLoading(false);
    };
    load();
  }, []);

  const statusStyle = (status) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700 border border-green-200";
      case "cancelled": return "bg-red-100 text-red-600 border border-red-200";
      default: return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-red-500 text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-6 h-px bg-red-500 inline-block" /> Your Orders
            </p>
            <h1 className="text-gray-900 text-4xl font-black">Order History</h1>
          </div>
          <button onClick={() => navigate("/products")}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition text-sm">
            + New Order
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-7xl mb-6">📦</div>
            <h2 className="text-gray-700 text-2xl font-black mb-3">No orders yet</h2>
            <p className="text-gray-400 mb-8">Your order history will appear here.</p>
            <button onClick={() => navigate("/products")}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden">

                {/* Order header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500 font-black text-sm">
                      #{order.id}
                    </div>
                    <div>
                      <p className="text-gray-800 font-bold">Order #{order.id}</p>
                      <p className="text-gray-400 text-xs">{formatDate(order.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-bold capitalize ${statusStyle(order.status)}`}>
                      {order.status || "pending"}
                    </span>
                    <p className="text-red-600 font-black text-xl">
                      ${parseFloat(order.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                {/* Order items */}
                {order.items && order.items.length > 0 && (
                  <div className="px-6 py-4 space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          {item.product?.product_name || `Product #${item.product_id}`}
                          <span className="text-gray-300 ml-2">× {item.qty}</span>
                        </span>
                        <span className="text-gray-700 font-medium">
                          ${(parseFloat(item.price) * item.qty).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {order.note && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-400 text-xs italic">📝 {order.note}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistoryPage;