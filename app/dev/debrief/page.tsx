"use client";

import Debrief from "@/components/Debrief";
import { problemCatalog } from "@/content/gyms/catalog";

/** Review page for the post-win Debrief (editorial + elaborative prompt + reference). */
export default function DebriefDev() {
  const p = problemCatalog["cargo-total"];
  return <Debrief title={p.meta.title} editorial={p.editorial} reference={p.reference} prompt={p.prompt} onContinue={() => {}} />;
}
