import { useEffect, useState, useCallback, useRef, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { request } from "../../util/api";
import { useCart } from "../../store/CartContext";
import { AdminModeContext } from "../../components/layout/MainLayout";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/storage/";
const API_URL = "http://127.0.0.1:8000/api/";

function ProductMenu({ item, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="w-8 h-8 flex items-center justify-center bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow text-gray-600 hover:text-gray-900 transition text-lg font-bold"
      >
        ···
      </button>
      {open && (
        <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-gray-100 z-20 w-36 overflow-hidden">
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false); onEdit(item); }}
            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition"
          >
            ✏️ Edit
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false); onDelete(item.id); }}
            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
}

function ProductPage() {
  const [searchParams] = useSearchParams();
  const [list, setList] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category_id") ? Number(searchParams.get("category_id")) : null
  );
  const [selectedBrand] = useState(
    searchParams.get("brand_id") ? Number(searchParams.get("brand_id")) : null
  );
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({
    category_id: "", brand_id: "", product_name: "",
    description: "", qty: "", price: "", status: "1",
  });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const { addToCart, totalItems, setIsCartOpen } = useCart();
  const adminMode = useContext(AdminModeContext);
  const [addedIds, setAddedIds] = useState({});

  useEffect(() => {
    const loadMeta = async () => {
      const [catRes, brandRes] = await Promise.all([
        request("categories", "get"),
        request("brands", "get"),
      ]);
      if (catRes) setCategories(catRes.data || []);
      if (brandRes) setBrands(brandRes.list || brandRes.data || []);
    };
    loadMeta();
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const params = {};
    if (selectedCategory) params.category_id = selectedCategory;
    if (selectedBrand) params.brand_id = selectedBrand;
    if (search) params.keyword = search;
    const res = await request("products", "get", params);
    if (res) { setList(res.data || []); setCount(res.count || 0); }
    setLoading(false);
  }, [selectedCategory, selectedBrand, search]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const handleSearch = (e) => { e.preventDefault(); setSearch(keyword); };

  const openAdd = () => {
    setEditItem(null);
    setForm({ category_id: "", brand_id: "", product_name: "", description: "", qty: "", price: "", status: "1" });
    setImageFile(null);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      category_id: item.category_id, brand_id: item.brand_id,
      product_name: item.product_name, description: item.description || "",
      qty: item.qty, price: item.price, status: String(item.status),
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    if (imageFile) formData.append("image", imageFile);
    try {
      if (editItem) {
        formData.append("_method", "PUT");
        await axios.post(`${API_URL}products/${editItem.id}`, formData, { headers: { Accept: "application/json" } });
      } else {
        await axios.post(`${API_URL}products`, formData, { headers: { Accept: "application/json" } });
      }
      setShowModal(false);
      loadProducts();
    } catch {
      alert("Something went wrong. Please check all fields.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    await request(`products/${deleteId}`, "delete");
    setDeleteId(null);
    loadProducts();
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    setAddedIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => setAddedIds((prev) => ({ ...prev, [item.id]: false })), 1500);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input type="text" placeholder="Search products..." value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="border border-gray-300 focus:border-red-500 focus:outline-none p-2 rounded-lg px-4 text-sm w-56" />
          <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition">Search</button>
          {search && (
            <button type="button" onClick={() => { setKeyword(""); setSearch(""); }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm transition">Clear</button>
          )}
        </form>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Total: {count}</span>
          <button onClick={() => setIsCartOpen(true)}
            className="relative bg-white border border-gray-200 hover:border-red-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2">
            Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </button>
          {adminMode && (
            <button onClick={openAdd} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
              + Add Product
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-3 flex-wrap mb-8">
        <button onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${selectedCategory === null ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"}`}>
          All
        </button>
        {categories.map((cat) => (
          <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${selectedCategory === cat.id ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"}`}>
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><p className="text-gray-400 text-lg">Loading products...</p></div>
      ) : list.length === 0 ? (
        <p className="text-gray-400 text-center mt-20">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {list.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden flex flex-col">
              <div className="relative">
                {item.image ? (
                  <img src={BASE_URL + item.image} alt={item.product_name} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-300 text-4xl">📦</div>
                )}
                {adminMode && (
                  <div className="absolute top-2 right-2">
                    <ProductMenu item={item} onEdit={openEdit} onDelete={setDeleteId} />
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-gray-800 mb-1 truncate">{item.product_name}</h3>
                <p className="text-red-600 font-bold mb-1">${parseFloat(item.price).toLocaleString()}</p>
                <p className="text-sm text-gray-400 mb-3">Stock: {item.qty}</p>
                <div className="flex justify-between items-center text-xs mb-4">
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full">{item.category?.name}</span>
                  <span className="text-gray-400">{item.brand?.name}</span>
                </div>
                <button onClick={() => handleAddToCart(item)}
                  disabled={addedIds[item.id] || item.qty <= 0}
                  className={`mt-auto w-full py-2 rounded-lg text-sm font-semibold transition ${addedIds[item.id] ? "bg-green-500 text-white"
                      : item.qty <= 0 ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }`}>
                  {addedIds[item.id] ? "✓ Added!" : item.qty <= 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-screen overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">{editItem ? "Edit Product" : "Add Product"}</h2>
              <form onSubmit={handleSave}>
                <div className="mb-4">
                  <label className="text-sm font-semibold text-gray-600 mb-1 block">Product Name</label>
                  <input type="text" value={form.product_name}
                    onChange={(e) => setForm({ ...form, product_name: e.target.value })}
                    className="w-full border border-gray-300 focus:border-red-500 focus:outline-none p-3 rounded-lg" required />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600 mb-1 block">Category</label>
                    <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                      className="w-full border border-gray-300 focus:border-red-500 focus:outline-none p-3 rounded-lg" required>
                      <option value="">Select category</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600 mb-1 block">Brand</label>
                    <select value={form.brand_id} onChange={(e) => setForm({ ...form, brand_id: e.target.value })}
                      className="w-full border border-gray-300 focus:border-red-500 focus:outline-none p-3 rounded-lg" required>
                      <option value="">Select brand</option>
                      {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600 mb-1 block">Price</label>
                    <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="w-full border border-gray-300 focus:border-red-500 focus:outline-none p-3 rounded-lg" required />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600 mb-1 block">Qty</label>
                    <input type="number" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })}
                      className="w-full border border-gray-300 focus:border-red-500 focus:outline-none p-3 rounded-lg" required />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="text-sm font-semibold text-gray-600 mb-1 block">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full border border-gray-300 focus:border-red-500 focus:outline-none p-3 rounded-lg" rows={3} />
                </div>
                <div className="mb-4">
                  <label className="text-sm font-semibold text-gray-600 mb-1 block">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full border border-gray-300 focus:border-red-500 focus:outline-none p-3 rounded-lg">
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label className="text-sm font-semibold text-gray-600 mb-1 block">
                    Image {editItem && "(leave empty to keep current)"}
                  </label>
                  <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full text-sm text-gray-500" />
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={saving}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-3 rounded-lg font-semibold transition">
                    {saving ? "Saving..." : editItem ? "Update" : "Add Product"}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold transition">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center">
            <div className="text-5xl mb-4">🗑️</div>
            <h2 className="text-xl font-bold mb-2">Delete Product?</h2>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition">Yes, Delete</button>
              <button onClick={() => setDeleteId(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold transition">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductPage;