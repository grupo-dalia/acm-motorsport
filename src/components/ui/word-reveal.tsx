/**
 * Titular que sube palabra a palabra al cargar. Solo CSS (sin JS ni riesgo de hidratación);
 * con "reducir movimiento" el texto aparece directamente.
 */
export function WordReveal({ text, delay = 0, step = 0.055 }: { text: string; delay?: number; step?: number }) {
  const words = text.split(" ");
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <span key={i}>
            <span className="word-mask">
              <span className="word-rise" style={{ animationDelay: `${delay + i * step}s` }}>{w}</span>
            </span>
            {i < words.length - 1 && " "}
          </span>
        ))}
      </span>
    </>
  );
}
