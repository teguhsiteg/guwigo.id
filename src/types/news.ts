import { Timestamp } from "firebase/firestore";

export type NewsStatus = "published" | "draft" | "archived";

export interface NewsArticle {
  id?: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  coverImage: string;
  author: {
    name: string;
    avatar?: string;
    role?: string;
  };
  status: NewsStatus;
  isFeatured?: boolean;
  views?: number;
  publishedAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const NEWS_CATEGORIES = [
  "Teknologi",
  "Pengumuman",
  "Bisnis & UMKM",
  "Event & Workshop",
  "Update Produk",
  "Tutorial & Wawasan",
];
