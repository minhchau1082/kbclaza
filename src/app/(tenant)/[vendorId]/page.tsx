import { getVendorById } from "@/lib/firebase/services/vendor";
import { getProductsByVendor } from "@/lib/firebase/services/product";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export default async function VendorLandingPage({ params }: { params: Promise<{ vendorId: string }> }) {
  const resolvedParams = await params;
  const vendorId = resolvedParams.vendorId;

  // Gọi Database lấy thông tin
  const vendor = await getVendorById(vendorId);
  const products = await getProductsByVendor(vendorId);

  // Nếu shop không tồn tại
  if (!vendor) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-4">
        <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl">🏪</span>
        </div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Không tìm thấy cửa hàng</h1>
        <p className="text-neutral-500 max-w-md">Cửa hàng "{vendorId}" không tồn tại hoặc đã bị tạm khóa trên hệ thống KBC Laza.</p>
        <Button className="mt-8 rounded-full" variant="outline">Quay lại trang chủ</Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Banner Quảng Cáo */}
      <div className="w-full h-[40vh] md:h-[50vh] bg-neutral-900 relative flex flex-col items-center justify-center text-center p-6 overflow-hidden">
        {/* Lớp màu gradient che phủ làm mờ */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 to-purple-900/80 z-10"></div>
        {/* Bạn có thể chèn ảnh thật vào thẻ img bên dưới sau này */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000')] bg-cover bg-center"></div>
        
        <div className="relative z-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <Badge className="mb-6 bg-white/20 text-white hover:bg-white/30 border-none px-4 py-1.5 text-sm backdrop-blur-md rounded-full shadow-lg">
            Khách thuê chính thức
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6 drop-shadow-md">
            {vendor.name}
          </h1>
          <p className="text-xl text-neutral-200 max-w-2xl font-medium mx-auto">
            {vendor.description || "Chào mừng bạn đến với cửa hàng chính hãng của chúng tôi. Chất lượng tạo nên sự tin tưởng."}
          </p>
        </div>
      </div>

      {/* Khung chứa Sản phẩm */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Sản phẩm nổi bật</h2>
            <p className="text-neutral-500 mt-2">Cập nhật những mẫu mới nhất từ {vendor.name}</p>
          </div>
          <Button variant="outline" className="hidden sm:inline-flex rounded-full">Xem tất cả</Button>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-neutral-300 shadow-sm">
            <p className="text-neutral-500 text-lg">Cửa hàng đang cập nhật sản phẩm. Vui lòng quay lại sau.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="group overflow-hidden border border-neutral-100 bg-white shadow-sm hover:shadow-2xl transition-all duration-300 rounded-3xl cursor-pointer flex flex-col">
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-50">
                  {/* Nếu có hình ảnh thì hiển thị, không thì hiện khung xám */}
                  {product.images && product.images.length > 0 ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400 bg-neutral-100">
                      Chưa có ảnh
                    </div>
                  )}
                  
                  {/* Badge Hết hàng */}
                  {product.stock === 0 && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="destructive" className="shadow-lg font-bold">Hết hàng</Badge>
                    </div>
                  )}
                  
                  {/* Nút giỏ hàng nổi lên khi hover */}
                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out flex justify-center">
                    <Button className="w-full bg-white/90 text-neutral-900 hover:bg-indigo-600 hover:text-white backdrop-blur-md rounded-full font-semibold shadow-lg">
                      Thêm vào giỏ
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-neutral-900 line-clamp-2 mb-1 group-hover:text-indigo-600 transition-colors">
                      {product.name}
                    </h3>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-bold text-xl text-indigo-600 tracking-tight">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
