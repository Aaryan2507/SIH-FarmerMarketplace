import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import CustomerHome from "./pages/customer/CustomerHome";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import SellerDashboard from "./pages/seller/SellerDashboard";
import ListProduce from "./pages/seller/ListProduce";
import StockDemand from "./pages/seller/StockDemand";
import Earnings from "./pages/seller/Earnings";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="page">
            <Navbar />

            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />

              {/* Customer-facing routes */}
              <Route path="/shop" element={<CustomerHome />} />
              <Route path="/cart" element={<Cart />} />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute allowedRole="customer">
                    <Checkout />
                  </ProtectedRoute>
                }
              />

              {/* Seller-facing routes */}
              <Route
                path="/seller"
                element={
                  <ProtectedRoute allowedRole="seller">
                    <SellerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seller/listings"
                element={
                  <ProtectedRoute allowedRole="seller">
                    <ListProduce />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seller/demand"
                element={
                  <ProtectedRoute allowedRole="seller">
                    <StockDemand />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seller/earnings"
                element={
                  <ProtectedRoute allowedRole="seller">
                    <Earnings />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
