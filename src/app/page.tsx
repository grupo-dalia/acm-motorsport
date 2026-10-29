import { HomeHero, Intro, TheCar, DakarSection, ShopSection, Worlds, PartnersSection } from "@/components/sections/home";
import { catalog } from "@/integrations/commerce";
import { JsonLd, personLd } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const metadata = { alternates: { canonical: absoluteUrl("/") } };

export default async function HomePage() {
  const products = (await catalog.listProducts()).filter((p) => p.featured);
  return (
    <>
      <JsonLd data={personLd()} />
      <HomeHero />
      <Intro />
      <TheCar />
      <DakarSection />
      <ShopSection products={products} />
      <Worlds />
      <PartnersSection />
    </>
  );
}
