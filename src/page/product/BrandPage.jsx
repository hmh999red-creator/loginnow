import { useEffect, useState } from "react";
import { request } from "../../util/api";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://127.0.0.1:8000/storage/";

function BrandPage() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBrands = async () => {
      const res = await request("brands", "get");
      if (res) setList(res.list || []);
      setLoading(false);
    };
    getBrands();
  }, []);
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Brands</h1>
        <span className="text-sm text-gray-500">Total: {list.length}</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-400 text-lg">Loading brands...</p>
        </div>
      ) : list.length === 0 ? (
        <p className="text-gray-400 text-center mt-20">No brands found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {list.map((item) => (
            <div
              key={item.id}

              onClick={() => navigate(`/products?brand_id=${item.id}`)}

              className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden group cursor-pointer"
            >
              {item.image ? (
                <img
                  src={BASE_URL + item.image}
                  alt={item.name}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-40 bg-red-50 flex items-center justify-center">
                  <span className="text-4xl">🏷️</span>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-1 group-hover:text-red-600 transition">
                  {item.name}
                </h3>
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  Code: {item.code}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BrandPage;