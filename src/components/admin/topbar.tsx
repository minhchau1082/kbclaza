import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Topbar() {
  return (
    <header className="h-16 bg-white border-b px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden sm:flex relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
          <input
            type="search"
            placeholder="Tìm kiếm..."
            className="bg-neutral-50 rounded-full border border-neutral-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 pl-9 pr-4 py-1.5 text-sm transition-all outline-none w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-neutral-600" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
        </Button>
        <div className="h-9 w-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold shadow-sm cursor-pointer hover:bg-indigo-200 transition-colors">
          A
        </div>
      </div>
    </header>
  );
}
