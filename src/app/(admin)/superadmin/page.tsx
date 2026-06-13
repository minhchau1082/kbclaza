export default function SuperAdminDashboard() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-red-600">Super Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Khu vực quản trị hệ thống tổng (Dành riêng cho bạn).</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
          <h3 className="font-semibold text-lg tracking-tight">Quản lý Doanh nghiệp</h3>
          <p className="text-sm text-muted-foreground mt-2">Duyệt và kiểm soát các Vendor đăng ký trên hệ thống.</p>
        </div>
        <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
          <h3 className="font-semibold text-lg tracking-tight">Báo cáo Doanh thu</h3>
          <p className="text-sm text-muted-foreground mt-2">Theo dõi băng thông và tổng số đơn hàng của toàn nền tảng.</p>
        </div>
      </div>
    </div>
  );
}
