const words = ["Rally raid", "Regularidad", "4x4", "Overland", "Mecánica", "Fabricación", "Electrónica", "Sim racing", "Objetivo Dakar"];

export function Marquee() {
  const row = [...words, ...words];
  return (
    <div className="relative overflow-hidden border-y border-line bg-surface py-5" aria-hidden>
      <div className="flex w-max animate-marquee gap-10 motion-reduce:animate-none">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap">
            <span className="display text-2xl text-paper/85 sm:text-3xl">{w}</span>
            <span className="size-2 rotate-45 bg-racing" />
          </span>
        ))}
      </div>
    </div>
  );
}
