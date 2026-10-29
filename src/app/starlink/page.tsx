import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { YouTubePlayer } from "@/components/media/youtube-player";
import { JsonLd, breadcrumbLd, pageMetadata } from "@/lib/seo";
import { affiliateById } from "@/content/affiliates";

/**
 * Página de aterrizaje del referido de Starlink, pensada para búsquedas tipo
 * "starlink 45 euros", "código descuento starlink", "enlace referido starlink".
 * Regla: solo afirmar lo que dice Starlink en su propio mensaje de invitación. Divulgación siempre visible.
 */
const REWARD = "45 €";
const updated = "octubre de 2026";

export const metadata: Metadata = pageMetadata({
  title: `Starlink con ${REWARD} de regalo: enlace de referido`,
  description: `Date de alta en Starlink con nuestro enlace de referido y consigue ${REWARD} en efectivo o en saldo de servicio. Lo llevamos en el techo de un Pajero de rally: así funciona de verdad.`,
  path: "/starlink",
  image: "https://i.ytimg.com/vi/3aBYyv4A7fs/maxresdefault.jpg",
});

const faqs = [
  {
    q: "¿Cómo consigo los 45 € de Starlink?",
    a: `Entrando en Starlink desde nuestro enlace de referido y completando el alta. Según el propio mensaje de invitación de Starlink, al registrarte así obtienes ${REWARD} en efectivo o en saldo de servicio. Se aplican los términos de Starlink, que pueden cambiar según país y tarifa.`,
  },
  {
    q: "¿Es un código de descuento?",
    a: "No hace falta escribir ningún código. El referido va dentro del enlace: basta con entrar desde él y completar el alta en la web oficial de Starlink.",
  },
  {
    q: "¿Pago más por usar el enlace?",
    a: "No. Pagas lo mismo que entrando directamente en starlink.com. Nosotros también recibimos una recompensa de Starlink por recomendarlo, y eso ayuda a financiar el proyecto Objetivo Dakar.",
  },
  {
    q: "¿Funciona Starlink Mini en un coche en movimiento?",
    a: "Lo usamos en el techo del Pajero. En el vídeo de esta página tienes la instalación y una prueba real en marcha, con lo que funciona y lo que no.",
  },
  {
    q: "¿Dónde se monta en un todoterreno?",
    a: "Donde vea el cielo sin obstáculos y se pueda sellar bien. En nuestro Pajero va en la parte delantera del techo, porque la trasera tiene techo solar.",
  },
];

export default function StarlinkPage() {
  const a = affiliateById("starlink");
  const href = a?.url ? "/go/starlink" : null;
  const crumbs = [{ label: "Starlink", href: "/starlink" }];

  const cta = href ? (
    <a href={href} rel="sponsored nofollow" className="inline-flex h-14 items-center rounded-[var(--radius-btn)] bg-racing px-8 text-lg font-medium text-paper no-underline transition-colors hover:bg-racing-dark">
      Conseguir {REWARD} con Starlink
    </a>
  ) : null;

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <PageHero
        title={`Starlink con ${REWARD} de regalo.`}
        lead={`Entra desde nuestro enlace de referido, date de alta y Starlink te da ${REWARD} en efectivo o en saldo de servicio.`}
        crumbs={crumbs}
      >
        <div className="mt-10 flex flex-wrap items-center gap-6">
          {cta}
          <p className="t-small opacity-60">Enlace de referido · actualizado en {updated}</p>
        </div>
      </PageHero>

      <section className="on-paper">
        <Container className="grid gap-14 py-24 lg:grid-cols-12 lg:py-32">
          <div className="lg:col-span-5">
            <h2 className="t-display">Cómo funciona</h2>
            <ol className="mt-10 space-y-8 text-lg">
              <li><strong className="block t-title">1. Entra desde el enlace</strong><span className="text-slate">Te lleva a la web oficial de Starlink con nuestro referido ya puesto. No hay que copiar ningún código.</span></li>
              <li><strong className="block t-title">2. Elige kit y tarifa</strong><span className="text-slate">Residencial o itinerante, antena estándar o Mini. El precio es el mismo que entrando directamente.</span></li>
              <li><strong className="block t-title">3. Completa el alta</strong><span className="text-slate">Cuando se cumplan las condiciones de Starlink, recibes {REWARD} en efectivo o en saldo de servicio.</span></li>
            </ol>
            <div className="mt-12">{cta}</div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <h2 className="t-title">La llevamos en el techo de un coche de rally</h2>
            <p className="mt-4 text-lg text-slate">
              No te lo recomendamos desde un sofá. Nuestro Starlink Mini va montado en un Mitsubishi Pajero MK1 de 1989 que compite en rally todoterreno. Nos da conexión en pista para el GPS de regularidad, para subir vídeo y para emitir en directo.
            </p>
            <YouTubePlayer id="3aBYyv4A7fs" title="Instalación de Starlink Mini en el Pajero" className="mt-8 rounded-[6px]" />
          </div>
        </Container>
      </section>

      <section className="bg-midnight">
        <Container className="py-24 lg:py-32">
          <h2 className="t-display max-w-[18ch]">Preguntas frecuentes</h2>
          <dl className="mt-12 grid gap-x-16 gap-y-10 lg:grid-cols-2">
            {faqs.map((f) => (
              <div key={f.q}>
                <dt className="t-title">{f.q}</dt>
                <dd className="mt-3 text-lg opacity-75">{f.a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-16 max-w-[70ch] t-small opacity-60">
            Transparencia: este es un enlace de referido de Andrés Cubero Moreno. Si te das de alta a través de él, Starlink nos da una recompensa sin coste extra para ti. Importes y condiciones según los términos vigentes de Starlink en tu país; ACM Motorsport no está afiliado a Starlink ni a SpaceX más allá de su programa de referidos.
          </p>
        </Container>
      </section>
    </>
  );
}
