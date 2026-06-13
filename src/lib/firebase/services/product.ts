import { db } from "../config";
import { collection, getDocs, query, where, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";

export interface Product {
  id?: string;
  productId: string;
  vendorId: string;
  name: string;
  price: number;
  images: string[];
  stock: number;
  isActive: boolean;
  createdAt?: Date;
}

const COLLECTION_NAME = "products";

/**
 * Lấy danh sách sản phẩm theo ID của Doanh nghiệp
 */
export async function getProductsByVendor(vendorId: string): Promise<Product[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), where("vendorId", "==", vendorId));
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    querySnapshot.forEach((docSnap) => {
      products.push({ id: docSnap.id, ...docSnap.data() } as Product);
    });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

/**
 * Thêm sản phẩm mới cho doanh nghiệp
 */
export async function addProduct(productData: Omit<Product, "id">) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...productData,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding product:", error);
    return null;
  }
}
