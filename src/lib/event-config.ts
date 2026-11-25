export interface EventConfig {
  slug: string;
  title: string;
  subtitle: string;
  theme: "theme-pocari" | "theme-maybank" | "theme-borobudur" | "theme-sunset" | "theme-cyber" | "theme-emerald";
  categories: string[];
  defaultCategory: string;
  hashtag: string;
  organizer: string;
}

export const EVENT_DATABASE: Record<string, EventConfig> = {
  "pocari-sweat-run-2026": {
    slug: "pocari-sweat-run-2026",
    title: "POCARI SWEAT RUN 2026",
    subtitle: "BANDUNG · GEDUNG SATE",
    theme: "theme-pocari",
    categories: ["5K", "10K", "21K", "42K"],
    defaultCategory: "21K",
    hashtag: "#PocariRun2026 #BandungLari",
    organizer: "BeyondPace & Pocari Sweat",
  },
  "pocari-bandung": {
    slug: "pocari-bandung",
    title: "POCARI SWEAT RUN 2026",
    subtitle: "BANDUNG · GEDUNG SATE",
    theme: "theme-pocari",
    categories: ["5K", "10K", "21K", "42K"],
    defaultCategory: "21K",
    hashtag: "#PocariRun2026 #BandungLari",
    organizer: "BeyondPace & Pocari Sweat",
  },
  "maybank-marathon-2026": {
    slug: "maybank-marathon-2026",
    title: "MAYBANK MARATHON 2026",
    subtitle: "BALI · GIANYAR",
    theme: "theme-maybank",
    categories: ["10K", "21K", "42K"],
    defaultCategory: "42K",
    hashtag: "#MaybankMarathon2026 #PushYourLimit",
    organizer: "Maybank Indonesia",
  },
  "borobudur-marathon-2026": {
    slug: "borobudur-marathon-2026",
    title: "BOROBUDUR MARATHON 2026",
    subtitle: "MAGELANG · CANDI BOROBUDUR",
    theme: "theme-borobudur",
    categories: ["10K", "21K", "42K"],
    defaultCategory: "21K",
    hashtag: "#BorobudurMarathon #MenembusBatas",
    organizer: "Bank Jateng & Harian Kompas",
  },
  "jakarta-running-fest": {
    slug: "jakarta-running-fest",
    title: "JAKARTA RUNNING FEST 2026",
    subtitle: "GBK SENAYAN · JAKARTA",
    theme: "theme-cyber",
    categories: ["5K", "10K", "21K", "42K"],
    defaultCategory: "10K",
    hashtag: "#JRF2026 #JakartaLari",
    organizer: "Jakarta Running Festival",
  },
  "sunset-trail-run": {
    slug: "sunset-trail-run",
    title: "SUNSET TRAIL RUN 2026",
    subtitle: "BROMO TENGGER SEMERU",
    theme: "theme-sunset",
    categories: ["10K", "25K", "50K Ultra"],
    defaultCategory: "25K",
    hashtag: "#SunsetTrail2026 #TrailRunIndonesia",
    organizer: "Trail Runners Indonesia",
  },
};

export function getEventBySlug(slug: string): EventConfig {
  const normalized = slug.toLowerCase().trim();
  if (EVENT_DATABASE[normalized]) {
    return EVENT_DATABASE[normalized];
  }

  // Format default fallback if unknown slug is entered (e.g. guwigo.com/event/kudus-marathon)
  const formattedTitle = slug
    .split("-")
    .map((w) => w.toUpperCase())
    .join(" ");

  return {
    slug: normalized,
    title: formattedTitle || "RACE CARD GENERATOR",
    subtitle: "OFFICIAL FINISHER CARD",
    theme: "theme-pocari",
    categories: ["5K", "10K", "21K", "42K"],
    defaultCategory: "21K",
    hashtag: `#${formattedTitle.replace(/\s+/g, "")} #FinisherCard`,
    organizer: "Guwigo Event Technology",
  };
}
