// import { useEffect, useState } from "react";
// import { request } from "./util/api";
// import "./App.css";

// function App() {
//   const [list, setList] = useState([]);
//   const [count, setTotal] = useState(0);

//   const base_url = 'http://127.0.0.1:8000/storage/';

//   useEffect(() => {
//     const getList = async() => {
//       const res = await request("products", "get", { category_id: 1 });

//       console.log("API:", res);

//       if (res) {
//         setList(res.data || []);
//         setTotal(res.count || 0);
//       }
//     };

//     getList();
//   }, []);

//   return (
//     <div className="container">
//       <h2>Count: {count}</h2>
//       <h3>List Length: {list.length}</h3>

//       <div className="grid">
//         {list.map((item) => (
//           <div key={item.id} className="card">
//             <div>
//               <img src={base_url + item.image} alt="" />
//             </div>
//             <h3>{item.product_name}</h3>
//             <p className="price">Price: ${item.price}</p>
//             <p>Qty: {item.qty}</p>

//             <div className="divider"></div>

//             <div className="meta">
//               <span className={`badge badge-${item.category?.name?.toLowerCase()}`}>
//                 {item.category?.name}
//               </span>

//               <span className="brand">
//                 {item.brand?.name}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./page/home/HomePage";
import BrandPage from "./page/product/BrandPage";
import ProductPage from "./page/product/ProductPage";
import CategoryPage from "./page/product/CategoryPage";
import NotFoundPage from "./page/error/NotFoundPage";
import MainLayout from "./components/layout/MainLayout";
import LoginPage from "./page/auth/LoginPage";
import RegisterPage from "./page/auth/RegisterPage";
import MainLayoutAuth from "./components/layout/MainLayoutAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import { CartProvider } from "./store/CartContext";
import CartDrawer from "./components/layout/CartDrawer";
import CheckoutPage from "./page/orders/CheckoutPage";
import OrderHistoryPage from "./page/orders/OrderHistoryPage";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <CartDrawer />
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="brands" element={<BrandPage />} />
              <Route path="categories" element={<CategoryPage />} />
              <Route path="products" element={<ProductPage />} />
              <Route path="orders/checkout" element={<CheckoutPage />} />
              <Route path="orders/history" element={<OrderHistoryPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Route>

          <Route element={<MainLayoutAuth />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;