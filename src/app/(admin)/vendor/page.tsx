import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";

export default function VendorDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Tổng quan cửa hàng</h1>
        <p className="text-neutral-500 mt-1">Chào mừng bạn trở lại, đây là tình hình kinh doanh hôm nay.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-none shadow-sm bg-white rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">Tổng doanh thu</CardTitle>
            <div className="h-8 w-8 bg-green-50 rounded-lg flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-900">14.500.000 ₫</div>
            <p className="text-xs text-green-600 flex items-center mt-1 font-medium">
              <TrendingUp className="h-3 w-3 mr-1" /> +12% so với hôm qua
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">Đơn hàng mới</CardTitle>
            <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-900">24</div>
            <p className="text-xs text-neutral-500 mt-1">4 đơn đang chờ xử lý</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">Sản phẩm</CardTitle>
            <div className="h-8 w-8 bg-indigo-50 rounded-lg flex items-center justify-center">
              <Package className="h-4 w-4 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-900">142</div>
            <p className="text-xs text-red-500 mt-1">3 sản phẩm sắp hết hàng</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm bg-white rounded-2xl h-96 flex items-center justify-center">
          <p className="text-neutral-400">Biểu đồ doanh thu (Đang cập nhật)</p>
        </Card>
        <Card className="border-none shadow-sm bg-white rounded-2xl h-96 flex items-center justify-center">
          <p className="text-neutral-400">Đơn hàng gần đây (Đang cập nhật)</p>
        </Card>
      </div>
    </div>
  );
}
