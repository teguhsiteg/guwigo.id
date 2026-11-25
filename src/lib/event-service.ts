import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { EventConfig, EVENT_DATABASE } from "./event-config";

const EVENTS_COLLECTION = "events";

/**
 * Fetch all events (from Firestore + fallbacks)
 */
export async function getAllEvents(): Promise<EventConfig[]> {
  try {
    const snap = await getDocs(collection(db, EVENTS_COLLECTION));
    if (!snap.empty) {
      const list: EventConfig[] = [];
      snap.forEach((doc) => {
        list.push(doc.data() as EventConfig);
      });
      return list;
    }
  } catch (err) {
    console.warn("Firestore fetch events fallback:", err);
  }

  // Return static default preset list
  return Object.values(EVENT_DATABASE);
}

/**
 * Get event by slug (Firestore first, fallback to static)
 */
export async function getEventData(slug: string): Promise<EventConfig> {
  const normalized = slug.toLowerCase().trim();
  try {
    const docRef = doc(db, EVENTS_COLLECTION, normalized);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as EventConfig;
    }
  } catch (err) {
    console.warn("Firestore get single event error:", err);
  }

  if (EVENT_DATABASE[normalized]) {
    return EVENT_DATABASE[normalized];
  }

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

/**
 * Save or update an event in Firestore
 */
export async function saveEvent(event: EventConfig): Promise<void> {
  const normalized = event.slug.toLowerCase().trim();
  const docRef = doc(db, EVENTS_COLLECTION, normalized);
  await setDoc(docRef, { ...event, slug: normalized }, { merge: true });
}

/**
 * Delete an event from Firestore
 */
export async function removeEvent(slug: string): Promise<void> {
  const normalized = slug.toLowerCase().trim();
  const docRef = doc(db, EVENTS_COLLECTION, normalized);
  await deleteDoc(docRef);
}
