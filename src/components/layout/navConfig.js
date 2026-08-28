import {
  LayoutDashboard,
  Boxes,
  ClipboardList,
  LineChart,
  Sparkles,
  UserRound,
  Home,
  Store,
  ShoppingCart,
  PackageSearch,
} from "lucide-react"

export const NAV_CONFIG = {
  farmer: {
    homePath: "/farmer",
    sidebar: [
      { label: "Dashboard", path: "/farmer", icon: LayoutDashboard },
      { label: "Inventory", path: "/farmer/inventory", icon: Boxes },
      { label: "Orders", path: "/farmer/orders", icon: ClipboardList },
      { label: "Market Prices", path: "/farmer/market-prices", icon: LineChart },
      { label: "Demand Insights", path: "/farmer/demand-insights", icon: Sparkles },
      { label: "Profile", path: "/farmer/profile", icon: UserRound },
    ],
    bottom: [
      { label: "Dashboard", path: "/farmer", icon: LayoutDashboard },
      { label: "Inventory", path: "/farmer/inventory", icon: Boxes },
      { label: "Orders", path: "/farmer/orders", icon: ClipboardList },
      { label: "Prices", path: "/farmer/market-prices", icon: LineChart },
      { label: "Profile", path: "/farmer/profile", icon: UserRound },
    ],
  },
  consumer: {
    homePath: "/consumer",
    sidebar: [
      { label: "Home", path: "/consumer", icon: Home },
      { label: "Marketplace", path: "/consumer/marketplace", icon: Store },
      { label: "Cart", path: "/consumer/cart", icon: ShoppingCart },
      { label: "Orders", path: "/consumer/orders", icon: ClipboardList },
      { label: "Profile", path: "/consumer/profile", icon: UserRound },
    ],
    bottom: [
      { label: "Home", path: "/consumer", icon: Home },
      { label: "Market", path: "/consumer/marketplace", icon: Store },
      { label: "Cart", path: "/consumer/cart", icon: ShoppingCart },
      { label: "Orders", path: "/consumer/orders", icon: ClipboardList },
      { label: "Profile", path: "/consumer/profile", icon: UserRound },
    ],
  },
  wholesaler: {
    homePath: "/wholesaler",
    sidebar: [
      { label: "Dashboard", path: "/wholesaler", icon: LayoutDashboard },
      { label: "Marketplace", path: "/wholesaler/marketplace", icon: Store },
      { label: "Bulk Orders", path: "/wholesaler/bulk-orders", icon: PackageSearch },
      { label: "Orders", path: "/wholesaler/orders", icon: ClipboardList },
      { label: "Market Prices", path: "/wholesaler/market-prices", icon: LineChart },
      { label: "Profile", path: "/wholesaler/profile", icon: UserRound },
    ],
    bottom: [
      { label: "Dashboard", path: "/wholesaler", icon: LayoutDashboard },
      { label: "Market", path: "/wholesaler/marketplace", icon: Store },
      { label: "Bulk", path: "/wholesaler/bulk-orders", icon: PackageSearch },
      { label: "Orders", path: "/wholesaler/orders", icon: ClipboardList },
      { label: "Profile", path: "/wholesaler/profile", icon: UserRound },
    ],
  },
}
