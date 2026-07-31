/**
 * Services and Products Types
 */

export interface ServicePackage {
  id?: string;
  name: string;
  price: number;
  features: string[];
  action: "tripay" | "wa";
}

export interface Service {
  id: string;
  title: string;
  category: string;
  description: string;
  iconName: string;
  packages: ServicePackage[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem extends Service {
  selectedPackage: ServicePackage;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  imageUrl?: string;
}
