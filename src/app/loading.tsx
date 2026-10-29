export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center" role="status" aria-label="Cargando">
      <span className="h-1 w-24 overflow-hidden bg-paper/10"><span className="block h-full w-1/3 animate-[marquee_1s_linear_infinite] bg-racing" /></span>
    </div>
  );
}
