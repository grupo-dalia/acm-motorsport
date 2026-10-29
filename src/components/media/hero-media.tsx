import { Contours, RouteLine } from "./contours";

/**
 * Fondo del hero. Con NEXT_PUBLIC_HERO_VIDEO_URL muestra el vídeo real (muted, loop, playsInline).
 * Sin él, composición cartográfica identificada como placeholder.
 */
export function HeroMedia() {
  const video = process.env.NEXT_PUBLIC_HERO_VIDEO_URL;
  const poster = process.env.NEXT_PUBLIC_HERO_POSTER_URL;
  if (video) {
    return (
      <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata" poster={poster || undefined} aria-hidden>
        <source src={video} />
      </video>
    );
  }
  return (
    <div className="noise absolute inset-0 overflow-hidden bg-[radial-gradient(120%_90%_at_70%_30%,#17294a_0%,#101e36_35%,#080a0f_80%)]">
      <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <Contours animate className="absolute inset-0 h-full w-full text-[#7f9cd1]/70" />
      <RouteLine className="absolute inset-0 h-full w-full text-racing" />
      <p className="absolute right-4 top-24 hidden lg:top-28 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-paper/40 sm:right-6 md:block lg:right-10">
        ▶ Vídeo pendiente · Pajero MK1 en competición
      </p>
    </div>
  );
}
