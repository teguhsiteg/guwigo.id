"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "sonner";

// Tipe Data Produk
export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
};

// Tipe Data Item di Keranjang (Produk + Quantity)
export type CartItem = Product & {
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, type: "plus" | "minus") => void;
  cartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // (Opsional) Load dari LocalStorage saat awal buka
  useEffect(() => {
    const savedCart = localStorage.getItem("guwigo_cart");
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // (Opsional) Simpan ke LocalStorage setiap ada perubahan
  useEffect(() => {
    localStorage.setItem("guwigo_cart", JSON.stringify(items));
  }, [items]);

  // FUNGSI 1: TAMBAH KE KERANJANG
  const addToCart = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        // Jika barang sudah ada, tambah quantity-nya saja
        toast.success(`Jumlah ${product.name} diperbarui di keranjang!`);
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      // Jika barang belum ada, masukkan sebagai item baru
      toast.success(`${product.name} berhasil masuk keranjang!`);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // FUNGSI 2: HAPUS DARI KERANJANG
  const removeFromCart = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.error("Barang dihapus dari keranjang.");
  };

  // FUNGSI 3: UPDATE QUANTITY (+ / -)
  const updateQty = (id: number, type: "plus" | "minus") => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty =
            type === "plus" ? item.quantity + 1 : item.quantity - 1;
          return { ...item, quantity: Math.max(1, newQty) };
        }
        return item;
      }),
    );
  };

  // Hitung total item (untuk Badge di Navbar)
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQty, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
