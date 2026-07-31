"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ShieldCheck,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext"; // Import Bahasa

export default function CartPage() {
  const { items, removeFromCart, updateQty } = useCart();
  const { t } = useLanguage(); // Gunakan Bahasa

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.11;
  const total = subtotal + tax;

  const toRupiah = (number: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/store"
            className="p-2 rounded-full bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <h1 className="text-2xl font-black text-slate-900">{t.cart.title}</h1>
          <span className="text-sm font-medium text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
            {items.length} {t.cart.items}
          </span>
        </div>

        {items.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* LIST ITEM */}
            <div className="flex-1 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-100 flex flex-col sm:flex-row gap-6 items-start sm:items-center group hover:border-blue-200 transition-all"
                >
                  {/* ... Image & Qty Control sama ... */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-100 rounded-2xl relative overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                      {item.category}
                    </p>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {item.name}
                    </h3>
                    <p className="text-blue-600 font-bold">
                      {toRupiah(item.price)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between w-full sm:w-auto sm:flex-col sm:items-end gap-4">
                    <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200">
                      <button
                        onClick={() => updateQty(item.id, "minus")}
                        className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white rounded-l-xl transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, "plus")}
                        className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white rounded-r-xl transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* SUMMARY */}
            <div className="w-full lg:w-96">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 sticky top-32 shadow-xl shadow-slate-200/50">
                <h3 className="text-xl font-bold text-slate-900 mb-6">
                  {t.cart.summary_title}
                </h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-slate-500 text-sm">
                    <span>{t.cart.subtotal}</span>
                    <span className="font-medium text-slate-900">
                      {toRupiah(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-sm">
                    <span>{t.cart.tax}</span>
                    <span className="font-medium text-slate-900">
                      {toRupiah(tax)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-sm">
                    <span>{t.cart.shipping}</span>
                    <span className="font-bold text-green-600">
                      {t.cart.shipping_calc}
                    </span>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">
                      {t.cart.total}
                    </span>
                    <span className="text-2xl font-black text-blue-600">
                      {toRupiah(total)}
                    </span>
                  </div>
                </div>
                <Link
                  href="/store/checkout"
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 group shadow-lg"
                >
                  {t.cart.checkout_btn}{" "}
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center text-center gap-2">
                    <ShieldCheck size={20} className="text-slate-400" />
                    <span className="text-[10px] text-slate-400 font-medium">
                      {t.cart.trust_warranty}
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <CreditCard size={20} className="text-slate-400" />
                    <span className="text-[10px] text-slate-400 font-medium">
                      {t.cart.trust_payment}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
            <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag size={64} className="text-slate-300" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              {t.cart.empty_title}
            </h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg font-light">
              {t.cart.empty_desc}
            </p>
            <Link
              href="/store"
              className="bg-slate-900 text-white font-bold px-10 py-4 rounded-full hover:bg-blue-600 transition-all shadow-lg"
            >
              {t.cart.empty_btn}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
