import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut, Store } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 bg-neutral-900 text-neutral-300 hidden md:flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-neutral-800 flex items-center gap-3 text-white">
        <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Store className="h-5 w-5" />
        </div>
        <span className="font-bold text-xl tracking-tight">KBC Admin</span>
      </div>

      <div className="flex-1 py-6 flex flex-col gap-2 px-4">
        <Link href="/vendor" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-neutral-800 hover:text-white transition-colors bg-neutral-800 text-white">
          <LayoutDashboard className="h-5 w-5" />
          <span>Tổng quan</span>
        </Link>
        <Link href="/vendor/products" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-neutral-800 hover:text-white transition-colors">
          <Package className="h-5 w-5" />
          <span>Sản phẩm</span>
        </Link>
        <Link href="/vendor/orders" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-neutral-800 hover:text-white transition-colors">
          <ShoppingCart className="h-5 w-5" />
          <span>Đơn hàng</span>
        </Link>
        <Link href="/vendor/settings" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-neutral-800 hover:text-white transition-colors">
          <Settings className="h-5 w-5" />
          <span>Cài đặt</span>
        </Link>
      </div>

      <div className="p-4 border-t border-neutral-800">
        <button className="flex items-center gap-3 px-3 py-2 w-full rounded-md hover:bg-red-500/10 hover:text-red-400 text-neutral-400 transition-colors">
          <LogOut className="h-5 w-5" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
