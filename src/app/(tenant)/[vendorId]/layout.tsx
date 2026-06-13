import { ShoppingBag, Search, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ vendorId: string }>;
}) {
  const resolvedParams = await params;
  const vendorId = resolvedParams.vendorId;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <Link href={`/${vendorId}`} className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-inner">
                {vendorId.charAt(0).toUpperCase()}
              </div>
              <span className="font-bold text-xl tracking-tight text-neutral-900 hidden sm:inline-block">
                {vendorId.toUpperCase()}
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              <input
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full bg-neutral-100 rounded-full border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 pl-10 pr-4 py-2 text-sm transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative group">
              <ShoppingBag className="h-5 w-5 text-neutral-600 group-hover:text-indigo-600 transition-colors" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 shadow-sm border border-white"></span>
            </Button>
            <Button className="hidden sm:inline-flex bg-neutral-900 text-white hover:bg-indigo-600 rounded-full px-6 transition-colors shadow-md">
              Đăng nhập
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Modern Footer */}
      <footer className="bg-white border-t py-12 mt-auto">
        <div className="container mx-auto px-4 text-center text-neutral-500">
          <p className="mb-2 font-medium">© 2026 {vendorId.toUpperCase()} Store. All rights reserved.</p>
          <p className="text-sm">Powered by KBC Laza Platform</p>
        </div>
      </footer>
    </div>
  );
}
