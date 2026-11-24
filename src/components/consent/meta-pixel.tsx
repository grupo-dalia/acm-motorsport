"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CONSENT_EVENT, initPixel, readMarketingConsent, revokePixel, trackPixel } from "@/lib/meta-pixel";

/**
 * Carga el Meta Pixel SOLO tras aceptar cookies de marketing, y manda PageView en cada cambio de ruta.
 * Sin NEXT_PUBLIC_META_PIXEL_ID no se renderiza (ver layout raíz).
 */
export function MetaPixel({ pixelId }: { pixelId: string }) {
  const pathname = usePathname();
  const [consent, setConsent] = useState(false);
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    const sync = () => {
      const ok = readMarketingConsent();
      setConsent((prev) => {
        if (prev && !ok) revokePixel();
        return ok;
      });
    };
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    window.addEventListener("storage", sync); // otra pestaña cambia las preferencias
    return () => {
      window.removeEventListener(CONSENT_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    if (!consent) return;
    initPixel(pixelId);
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    trackPixel("PageView");
  }, [consent, pathname, pixelId]);

  if (!consent) return null;
  return <Script id="meta-pixel" src="https://connect.facebook.net/en_US/fbevents.js" strategy="afterInteractive" />;
}
