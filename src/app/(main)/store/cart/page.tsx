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
    <div className="bg-[#FAF9F6] min-h-screen pt-32 pb-20 font-sans selection:bg-[#2563EB]/15 selection:text-[#0F172A]">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/store"
            className="flex items-center justify-center w-10 h-10 rounded-md bg-white text-[#0F172A] hover:bg-[#F1F5F9] transition-colors border border-[#E2E8F0]"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-3xl font-serif font-normal text-[#0F172A] tracking-tight">{t.cart.title}</h1>
          <span className="text-xs font-medium text-[#1D4ED8] bg-[#EFF6FF] border border-[#BFDBFE] px-3 py-1 rounded-md">
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
                  className="bg-white p-6 rounded-lg flex flex-col sm:flex-row gap-6 items-start sm:items-center border border-[#E2E8F0] shadow-sm transition-all"
                >
                  {/* Image */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#FAF9F6] rounded-md relative overflow-hidden flex-shrink-0 border border-[#E2E8F0]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-[#2563EB] uppercase tracking-wider mb-1">
                      {item.category}
                    </p>
                    <h3 className="text-lg font-serif font-normal text-[#0F172A] mb-1">
                      {item.name}
                    </h3>
                    <p className="text-[#0F172A] font-medium text-sm">
                      {toRupiah(item.price)}
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between w-full sm:w-auto sm:flex-col sm:items-end gap-4">
                    <div className="flex items-center bg-[#F1F5F9] border border-[#E2E8F0] rounded-md px-2 py-1">
                      <button
                        onClick={() => updateQty(item.id, "minus")}
                        className="w-7 h-7 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] transition-colors"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-7 text-center text-xs font-medium text-[#0F172A]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, "plus")}
                        className="w-7 h-7 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] transition-colors"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs font-medium text-[#EF4444] hover:underline transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* SUMMARY */}
            <div className="w-full lg:w-96">
              <div className="bg-white p-7 rounded-lg sticky top-32 border border-[#E2E8F0] shadow-sm">
                <h3 className="text-lg font-serif font-normal text-[#0F172A] mb-5">
                  {t.cart.summary_title}
                </h3>
                <div className="space-y-3.5 mb-6 text-xs">
                  <div className="flex justify-between text-[#64748B]">
                    <span>{t.cart.subtotal}</span>
                    <span className="text-[#0F172A] font-medium">
                      {toRupiah(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#64748B]">
                    <span>{t.cart.tax}</span>
                    <span className="text-[#0F172A] font-medium">
                      {toRupiah(tax)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#64748B]">
                    <span>{t.cart.shipping}</span>
                    <span className="text-[#2563EB]">
                      {t.cart.shipping_calc}
                    </span>
                  </div>
                </div>
                <div className="border-t border-[#E2E8F0] pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[#0F172A] text-sm">
                      {t.cart.total}
                    </span>
                    <span className="text-xl font-serif text-[#2563EB]">
                      {toRupiah(total)}
                    </span>
                  </div>
                </div>
                <Link
                  href="/store/checkout"
                  className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium py-3 rounded-md text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  {t.cart.checkout_btn}{" "}
                  <ArrowRight size={15} />
                </Link>
                <div className="mt-8 grid grid-cols-2 gap-4 border-t border-[#E2E8F0] pt-6">
                  <div className="flex flex-col items-center text-center gap-1.5">
                    <ShieldCheck size={18} className="text-[#06B6D4]" />
                    <span className="text-[10px] text-[#64748B] font-medium">
                      {t.cart.trust_warranty}
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-1.5">
                    <CreditCard size={18} className="text-[#06B6D4]" />
                    <span className="text-[10px] text-[#64748B] font-medium">
                      {t.cart.trust_payment}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up bg-white rounded-lg border border-[#E2E8F0] max-w-lg mx-auto p-12">
            <div className="w-16 h-16 bg-[#FAF9F6] border border-[#E2E8F0] rounded-md flex items-center justify-center mb-4 text-[#94A3B8]">
              <ShoppingBag size={28} />
            </div>
            <h2 className="text-xl font-serif font-normal text-[#0F172A] mb-2 tracking-tight">
              {t.cart.empty_title}
            </h2>
            <p className="text-xs text-[#64748B] mb-6 max-w-md mx-auto">
              {t.cart.empty_desc}
            </p>
            <Link
              href="/store"
              className="bg-[#2563EB] text-white font-medium px-7 py-3 rounded-md hover:bg-[#1D4ED8] transition-colors text-xs uppercase tracking-wider shadow-sm"
            >
              {t.cart.empty_btn}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
