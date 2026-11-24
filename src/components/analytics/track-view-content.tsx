"use client";

import { useEffect } from "react";
import { trackPixel } from "@/lib/meta-pixel";

/** ViewContent de Meta al abrir una ficha de producto (solo con consentimiento de marketing). */
export function TrackViewContent({ contentIds, valueCents }: { contentIds: string[]; valueCents: number }) {
  const key = contentIds.join(",");
  useEffect(() => {
    trackPixel("ViewContent", { contentIds: key.split(","), valueCents });
  }, [key, valueCents]);
  return null;
}
