import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Aboutus from "./pages/Aboutus";
import SingleProduct from "./pages/SingleProduct";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import CategoryPage from "./pages/CategoryPage";
// import OrderConfirmation from "./pages/OrderConfirmation";
// import AdminDashboard from './pages/AdminDashboard'
// import AdminAddProducts from './pages/AdminAddProducts'
import { ToastContainer } from "react-toastify";
import OrderSuccess from "./pages/OrderSuccess";
import OrderHistory from "./pages/OrderHistory";
import OrderDetail from "./pages/OrderDetail";

function App() {
  return (
    <>
    <ToastContainer />
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/Aboutus" element={<Aboutus />} />
          <Route path="/product/:id" element={<SingleProduct />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/category/:category_id" element={<CategoryPage />} />
          {/* <Route
            path="/order-confirmation/:orderId"
            element={<OrderConfirmation />}
          /> */}
          <Route path="order-success" element={<OrderSuccess />}></Route>
          <Route
              path="/orders"
              element={
               
                  <OrderHistory />
             
              }
            />
            <Route
              path="/order/:id"
              element={
                
                  <OrderDetail />
               
              }
            />

          {/* <Route path="/admin/dashboard" element={<AdminDashboard />}/>
      <Route path="/admin/add-products" element={<AdminAddProducts />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
