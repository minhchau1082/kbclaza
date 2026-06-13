import { db } from "../config";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface Vendor {
  vendorId: string;
  name: string;
  description: string;
  logoUrl?: string;
  theme?: {
    primaryColor: string;
    layoutTemplate: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

const COLLECTION_NAME = "vendors";

/**
 * Lấy thông tin cấu hình của Doanh nghiệp bằng ID
 */
export async function getVendorById(vendorId: string): Promise<Vendor | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, vendorId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Vendor;
    }
    return null;
  } catch (error) {
    console.error("Error fetching vendor:", error);
    return null;
  }
}

/**
 * Tạo mới hoặc cập nhật thông tin Doanh nghiệp
 */
export async function createOrUpdateVendor(vendorId: string, data: Partial<Vendor>) {
  try {
    const docRef = doc(db, COLLECTION_NAME, vendorId);
    await setDoc(docRef, { ...data, vendorId, updatedAt: new Date() }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating vendor:", error);
    return false;
  }
}
