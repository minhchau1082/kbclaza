import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { doc, setDoc, collection, addDoc, getDoc } from 'firebase/firestore';

export async function GET() {
  try {
    const vendorId = "shop-mau";
    
    // 1. Tạo dữ liệu Doanh nghiệp mẫu
    await setDoc(doc(db, "vendors", vendorId), {
      vendorId: vendorId,
      name: "KBCLAZA Official",
      description: "Thương hiệu thời trang cao cấp độc quyền trên nền tảng. Chất lượng làm nên uy tín.",
      isActive: true,
      createdAt: new Date(),
      theme: { primaryColor: "#4f46e5", layoutTemplate: "modern" }
    });

    // 2. Tạo dữ liệu Sản phẩm mẫu
    const productsRef = collection(db, "products");
    
    const sampleProducts = [
      {
        vendorId,
        name: "Áo Thun Nam Cao Cấp Cổ Tròn Mẫu Mới Nhất 2026",
        price: 250000,
        stock: 50,
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"],
        isActive: true,
        createdAt: new Date()
      },
      {
        vendorId,
        name: "Quần Jeans Nam Dáng Suông Phá Cách",
        price: 450000,
        stock: 30,
        images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80"],
        isActive: true,
        createdAt: new Date()
      },
      {
        vendorId,
        name: "Giày Sneaker Thể Thao Năng Động Đi Phượt",
        price: 850000,
        stock: 15,
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"],
        isActive: true,
        createdAt: new Date()
      },
      {
        vendorId,
        name: "Balo Vải Canvas Chống Nước (Bản Giới Hạn)",
        price: 320000,
        stock: 0, // Cố tình set 0 để hiển thị nhãn Hết hàng
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"],
        isActive: true,
        createdAt: new Date()
      }
    ];

    // Xóa sản phẩm cũ thì hơi phức tạp nên ở đây mình cứ tạo thêm nhé (demo)
    for (const product of sampleProducts) {
      await addDoc(productsRef, product);
    }

    return NextResponse.json({ 
      success: true, 
      message: "Đã tạo dữ liệu mẫu thành công! Bạn có thể truy cập /shop-mau để xem kết quả.",
      link: "/shop-mau"
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
