"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CONSENT_EVENT } from "@/lib/meta-pixel";

type Consent = { analytics: boolean; marketing: boolean; v: 1; at: string };
const KEY = "acm.consent.v1";
export const OPEN_PREFS_EVENT = "acm:open-cookie-prefs";

function readConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

/**
 * Banner de consentimiento: las cookies no esenciales (analítica, marketing) NO se cargan
 * hasta que el usuario las acepta. "Rechazar" tiene el mismo peso visual que "Aceptar".
 * Texto provisional pendiente de revisión jurídica.
 */
export function CookieConsent({ gaId }: { gaId?: string }) {
  const [consent, setConsent] = useState<Consent | null>(null);
  // El banner va en el HTML desde el servidor (se pinta a la vez que la página, sin esperar a JS);
  // si ya hay consentimiento, un script en <head> lo oculta antes de pintar y aquí se retira.
  const [visible, setVisible] = useState(true);
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const c = readConsent();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lectura única de almacenamiento del navegador tras montar
    setConsent(c);
    setVisible(!c);
    const open = () => {
      const cur = readConsent();
      setAnalytics(Boolean(cur?.analytics));
      setMarketing(Boolean(cur?.marketing));
      setCustom(true);
      setVisible(true);
    };
    window.addEventListener(OPEN_PREFS_EVENT, open);
    return () => window.removeEventListener(OPEN_PREFS_EVENT, open);
  }, []);

  const save = (c: Omit<Consent, "v" | "at">) => {
    const value: Consent = { ...c, v: 1, at: new Date().toISOString() };
    try {
      window.localStorage.setItem(KEY, JSON.stringify(value));
    } catch {}
    setConsent(value);
    window.dispatchEvent(new Event(CONSENT_EVENT)); // el píxel de Meta se activa o se retira sin recargar
    setVisible(false);
    setCustom(false);
  };

  return (
    <>
      {gaId && consent?.analytics && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {visible && (
        <div role="dialog" aria-modal="false" aria-labelledby="cookie-title" data-cookie-banner={custom ? "open" : ""} className="fixed inset-x-0 bottom-0 z-[70] border-t border-line-dark bg-paper px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 text-ink shadow-[0_-10px_40px_rgb(0_0_0/0.18)] sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-md sm:rounded-[8px] sm:border-0 sm:p-6 sm:shadow-[0_20px_60px_rgb(0_0_0/0.35)]">
          <p id="cookie-title" className="t-sub hidden sm:block">Cookies</p>
          {/* Móvil: versión corta en una franja para no tapar la ficha; mismo contenido esencial. */}
          <p className="text-[13px] leading-snug text-slate sm:hidden">
            <b className="font-semibold text-ink">Cookies:</b> técnicas para que la web funcione y, si aceptas, analíticas y de marketing para medir los anuncios. Nada se activa hasta que decidas.{" "}
            <Link href="/legal/cookies" className="underline underline-offset-2">Más info</Link>
          </p>
          <p className="mt-2 hidden text-sm leading-relaxed text-slate sm:block">
            Usamos cookies técnicas para que la web funcione (carrito, preferencias). Con tu permiso, también analíticas para saber qué contenido funciona y de marketing para medir nuestros anuncios. Nada se activa hasta que decidas.{" "}
            <Link href="/legal/cookies" className="underline underline-offset-4 hover:text-ink">Política de cookies</Link>.
          </p>
          {custom && (
            <fieldset className="mt-4 space-y-2 border-t border-line-dark pt-4 text-sm">
              <legend className="sr-only">Preferencias</legend>
              <label className="flex items-center justify-between gap-4 text-slate">
                Técnicas (necesarias) <input type="checkbox" checked disabled className="size-4 accent-racing" />
              </label>
              <label className="flex items-center justify-between gap-4">
                Analítica (Google Analytics 4) <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="size-4 accent-racing" />
              </label>
              <label className="flex items-center justify-between gap-4">
                Marketing (Meta Pixel) <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="size-4 accent-racing" />
              </label>
            </fieldset>
          )}
          <div className="mt-2.5 grid grid-cols-[auto_1fr_1fr] items-center gap-2 sm:mt-5 sm:flex sm:justify-end">
            {custom ? (
              <Button size="sm" variant="dark" className="col-span-3" onClick={() => save({ analytics, marketing })}>Guardar preferencias</Button>
            ) : (
              <>
                <Button size="sm" variant="text" onClick={() => setCustom(true)} className="px-2">Configurar</Button>
                <Button size="sm" variant="dark" onClick={() => save({ analytics: false, marketing: false })}>Rechazar</Button>
                <Button size="sm" variant="dark" onClick={() => save({ analytics: true, marketing: true })}>Aceptar</Button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export function CookiePrefsButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_PREFS_EVENT))}>
      Preferencias de cookies
    </button>
  );
}
