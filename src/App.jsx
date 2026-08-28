import { Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import { LocationProvider } from "./context/LocationContext"
import { ProtectedRoute, GuestRoute } from "./components/auth/ProtectedRoute"
import { AppLayout } from "./components/layout/AppLayout"

import LandingPage from "./pages/LandingPage"
import RoleSelectPage from "./pages/auth/RoleSelectPage"
import LoginPage from "./pages/auth/LoginPage"
import OtpLoginPage from "./pages/auth/OtpLoginPage"
import SignupPage from "./pages/auth/SignupPage"
import AadhaarVerifyPage from "./pages/auth/AadhaarVerifyPage"

import FarmerDashboard from "./pages/farmer/FarmerDashboard"
import FarmerInventory from "./pages/farmer/FarmerInventory"
import FarmerProductForm from "./pages/farmer/FarmerProductForm"
import FarmerMarketPrices from "./pages/farmer/FarmerMarketPrices"
import FarmerDemandInsights from "./pages/farmer/FarmerDemandInsights"
import FarmerOrders from "./pages/farmer/FarmerOrders"
import FarmerOrderDetail from "./pages/farmer/FarmerOrderDetail"
import FarmerProfile from "./pages/farmer/FarmerProfile"

import ConsumerHome from "./pages/consumer/ConsumerHome"
import ConsumerMarketplace from "./pages/consumer/ConsumerMarketplace"
import ConsumerProductDetail from "./pages/consumer/ConsumerProductDetail"
import ConsumerCart from "./pages/consumer/ConsumerCart"
import ConsumerCheckout from "./pages/consumer/ConsumerCheckout"
import ConsumerOrderConfirmation from "./pages/consumer/ConsumerOrderConfirmation"
import ConsumerOrders from "./pages/consumer/ConsumerOrders"
import ConsumerOrderDetail from "./pages/consumer/ConsumerOrderDetail"
import ConsumerProfile from "./pages/consumer/ConsumerProfile"

import WholesalerDashboard from "./pages/wholesaler/WholesalerDashboard"
import WholesalerMarketplace from "./pages/wholesaler/WholesalerMarketplace"
import WholesalerBulkOrder from "./pages/wholesaler/WholesalerBulkOrder"
import WholesalerOrders from "./pages/wholesaler/WholesalerOrders"
import WholesalerOrderDetail from "./pages/wholesaler/WholesalerOrderDetail"
import WholesalerMarketPrices from "./pages/wholesaler/WholesalerMarketPrices"
import WholesalerProfile from "./pages/wholesaler/WholesalerProfile"

import NotFoundPage from "./pages/NotFoundPage"

export default function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            <Route element={<GuestRoute />}>
              <Route path="/role-select" element={<RoleSelectPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/otp-login" element={<OtpLoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>

            <Route path="/aadhaar-verify" element={<AadhaarVerifyPage />} />

            <Route element={<ProtectedRoute allowedRoles={["farmer"]} />}>
              <Route path="/farmer" element={<AppLayout />}>
                <Route index element={<FarmerDashboard />} />
                <Route path="inventory" element={<FarmerInventory />} />
                <Route path="inventory/new" element={<FarmerProductForm />} />
                <Route path="inventory/:productId/edit" element={<FarmerProductForm />} />
                <Route path="market-prices" element={<FarmerMarketPrices />} />
                <Route path="demand-insights" element={<FarmerDemandInsights />} />
                <Route path="orders" element={<FarmerOrders />} />
                <Route path="orders/:orderId" element={<FarmerOrderDetail />} />
                <Route path="profile" element={<FarmerProfile />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["consumer"]} />}>
              <Route path="/consumer" element={<AppLayout />}>
                <Route index element={<ConsumerHome />} />
                <Route path="marketplace" element={<ConsumerMarketplace />} />
                <Route path="products/:productId" element={<ConsumerProductDetail />} />
                <Route path="cart" element={<ConsumerCart />} />
                <Route path="checkout" element={<ConsumerCheckout />} />
                <Route path="orders" element={<ConsumerOrders />} />
                <Route path="orders/:orderId" element={<ConsumerOrderDetail />} />
                <Route path="orders/:orderId/confirmation" element={<ConsumerOrderConfirmation />} />
                <Route path="profile" element={<ConsumerProfile />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["wholesaler"]} />}>
              <Route path="/wholesaler" element={<AppLayout />}>
                <Route index element={<WholesalerDashboard />} />
                <Route path="marketplace" element={<WholesalerMarketplace />} />
                <Route path="bulk-orders" element={<WholesalerBulkOrder />} />
                <Route path="marketplace/:productId" element={<WholesalerBulkOrder />} />
                <Route path="marketplace/:productId/bulk-order" element={<WholesalerBulkOrder />} />
                <Route path="orders" element={<WholesalerOrders />} />
                <Route path="orders/:orderId" element={<WholesalerOrderDetail />} />
                <Route path="market-prices" element={<WholesalerMarketPrices />} />
                <Route path="profile" element={<WholesalerProfile />} />
              </Route>
            </Route>

            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </CartProvider>
      </LocationProvider>
    </AuthProvider>
  )
}
