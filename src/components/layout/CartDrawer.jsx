import { useCart } from "../../store/CartContext";
import { useNavigate } from "react-router-dom";


const BASE_URL = "http://127.0.0.1:8000/storage/";

function CartDrawer() {
  const {
    cartItems,
    removeFromCart,
    updateQty,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
    clearCart,
  } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate("/orders/checkout");
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-40"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-bold">
            🛒 Cart{" "}
            <span className="text-sm text-gray-400 font-normal">
              ({cartItems.length} items)
            </span>
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="text-6xl mb-4">🛒</div>
              <p>Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-3 bg-gray-50 rounded-xl"
              >
                {item.image && (
                  <img
                    src={BASE_URL + item.image}
                    alt={item.product_name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800 truncate">
                    {item.product_name}
                  </p>
                  <p className="text-red-600 font-bold text-sm">
                    ${parseFloat(item.price).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">{item.brand?.name}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {/* Qty control */}
                  <div className="flex items-center gap-1 border rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQty(item.id, item.cartQty - 1)}
                      className="px-2 py-1 text-gray-600 hover:bg-gray-100 text-sm font-bold"
                    >
                      −
                    </button>
                    <span className="px-2 text-sm font-semibold">
                      {item.cartQty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.cartQty + 1)}
                      className="px-2 py-1 text-gray-600 hover:bg-gray-100 text-sm font-bold"
                      disabled={item.cartQty >= item.qty}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t px-6 py-4 space-y-3">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-800">
                ${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Checkout →
            </button>
            <button
              onClick={clearCart}
              className="w-full text-center text-sm text-gray-400 hover:text-red-500 transition"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default CartDrawer;