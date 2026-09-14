"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Share2,
  Tag,
  Clock,
  Check,
  Newspaper,
  Loader2,
  Building2,
} from "lucide-react";
import { NewsArticle } from "@/types/news";
import { toast } from "sonner";

export default function SingleNewsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchSingleArticle = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, "news"),
          where("slug", "==", slug),
          limit(1)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const docData = snap.docs[0];
          setArticle({ id: docData.id, ...docData.data() } as NewsArticle);
        } else {
          setArticle(null);
        }
      } catch (err) {
        console.error("Error fetching single article:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSingleArticle();
  }, [slug]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Tautan artikel berhasil disalin!");
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <Loader2 size={36} className="animate-spin text-blue-600 mx-auto" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Membuka Naskah Berita...
          </p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
            <Newspaper size={32} />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Artikel Tidak Ditemukan</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Artikel yang Anda tuju mungkin telah dipindahkan atau tautan yang Anda gunakan tidak valid.
          </p>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={14} /> Kembali ke Newsroom
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="bg-slate-50 min-h-screen pt-28 pb-24 font-sans selection:bg-blue-600 selection:text-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* BREADCRUMB & BACK */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft size={14} /> Kembali ke Berita
          </Link>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
            {copied ? "Tersalin!" : "Bagikan"}
          </button>
        </div>

        {/* ARTICLE HEADER */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-blue-50 border border-blue-100 text-blue-600 rounded-lg text-xs font-black uppercase tracking-wider">
              {article.category}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Calendar size={13} />
              {article.publishedAt?.toDate?.()?.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }) || "-"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {article.title}
          </h1>

          {article.summary && (
            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed border-l-4 border-blue-600 pl-4 py-1">
              {article.summary}
            </p>
          )}

          {/* AUTHOR INFO */}
          <div className="flex items-center gap-3 pt-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center font-black text-sm shadow-sm">
              {article.author?.name?.charAt(0) || "G"}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{article.author?.name || "Redaksi Guwigo"}</p>
              <p className="text-[10px] text-slate-400 font-medium">PT Guwigo Teknologi Indonesia</p>
            </div>
          </div>
        </div>

        {/* COVER IMAGE */}
        {article.coverImage && (
          <div className="relative w-full h-80 sm:h-[420px] rounded-3xl overflow-hidden mb-10 shadow-sm border border-slate-200">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* ARTICLE BODY */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
          <div className="prose prose-slate max-w-none text-slate-800 text-base sm:text-lg leading-relaxed whitespace-pre-line space-y-4">
            {article.content}
          </div>

          {/* TAGS */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-8 mt-10 border-t border-slate-100 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Tag size={12} /> Topik:
              </span>
              {article.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* ABOUT GUWIGO BOX */}
          <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-5">
            <div className="relative w-28 h-8 shrink-0">
              <Image
                src="/images/branding/logo-guwigo-new.png"
                alt="Guwigo Indonesia"
                fill
                className="object-contain"
              />
            </div>
            <div className="text-xs text-slate-600 leading-relaxed text-center sm:text-left">
              <strong>PT GUWIGO TEKNOLOGI INDONESIA</strong> adalah entitas pengembang perangkat lunak, sistem enterprise, dan transformasi digital yang berpusat di Yogyakarta. Hubungi kami untuk kebutuhan kemitraan teknologi dan publikasi media.
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
