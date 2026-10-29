import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { MediaPlaceholder } from "@/components/media/media-placeholder";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Flag, Compass, Cpu, Clapperboard } from "lucide-react";

const pillars = [
  { icon: Flag, title: "Competición", text: "Regularidad y rally raid con un coche que conocemos tornillo a tornillo." },
  { icon: Compass, title: "Aventura", text: "Pistas, navegación y kilómetros lejos del asfalto." },
  { icon: Cpu, title: "Ingeniería", text: "Electrónica propia, GPS RTK, Starlink y soluciones de taller." },
  { icon: Clapperboard, title: "Creación", text: "Todo se graba, se edita y se cuenta. Lo bueno y lo que se rompe." },
];

export function About() {
  return (
    <section className="py-24 lg:py-36" aria-labelledby="about-title">
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-5">
          <MediaPlaceholder label="Retrato de Andrés junto al Pajero" caption="Formato vertical 4:5 · mín. 1600 px" className="aspect-[4/5] w-full" />
        </Reveal>
        <div className="lg:col-span-6 lg:col-start-7 lg:pt-10">
          <SectionHeading
            index="01"
            eyebrow="El piloto"
            title={<span id="about-title">Andrés Cubero Moreno</span>}
            lead="Piloto de rally todoterreno, mecánico de taller y creador de contenido. Prepara el coche con el que compite, construye la electrónica que lleva dentro y lo documenta todo en vídeo."
          />
          <ul className="mt-12 grid gap-px bg-line sm:grid-cols-2">
            {pillars.map((p, i) => (
              <li key={p.title} className="bg-ink">
                <Reveal delay={i * 0.06} className="h-full p-6">
                  <p.icon className="size-5 text-racing" aria-hidden />
                  <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-paper/60">{p.text}</p>
                </Reveal>
              </li>
            ))}
          </ul>
          <ButtonLink href="/motorsport" variant="link" className="mt-10">Conoce al equipo →</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
