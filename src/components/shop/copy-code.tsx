"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** Botón con el código de descuento: se copia al tocarlo. */
export function CopyCode({ code }: { code: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
          setOk(true);
          setTimeout(() => setOk(false), 1800);
        } catch {}
      }}
      className="inline-flex h-12 items-center gap-2 rounded-[var(--radius-btn)] border-2 border-dashed border-ink px-5 font-[family-name:var(--font-display)] text-lg font-black italic tracking-[0.12em] text-ink hover:bg-ink/5"
      aria-label={`Copiar el código ${code}`}
    >
      {code}
      {ok ? <Check aria-hidden className="size-4 text-racing" /> : <Copy aria-hidden className="size-4 opacity-60" />}
      <span className="sr-only" aria-live="polite">{ok ? "Copiado" : ""}</span>
    </button>
  );
}
