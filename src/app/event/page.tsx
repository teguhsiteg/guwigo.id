import { redirect } from "next/navigation";

export default function EventIndexPage() {
  // Redirect /event ke daftar event atau event default
  redirect("/event/pocari-sweat-run-2026");
}
