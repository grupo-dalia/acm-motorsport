import { HomeHero, Intro, TheCar, DakarSection, LatestVideos, NewsSection, ShopSection, Worlds, PartnersSection } from "@/components/sections/home";
import { getChannelVideos, isPlaceholder } from "@/lib/youtube";
import { getArticles } from "@/lib/news";
import { catalog } from "@/integrations/commerce";
import { PromoBanner } from "@/components/promo/promo-banner";
import { Container } from "@/components/ui/container";
import { JsonLd, personLd, videoListLd } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const metadata = { alternates: { canonical: absoluteUrl("/") } };
export const revalidate = 3600; // vídeos de YouTube: se refrescan cada hora

export default async function HomePage() {
  const [products, channel, articles] = await Promise.all([catalog.listProducts().then((all) => all.filter((p) => p.featured)), getChannelVideos(), getArticles()]);
  const episodes = channel.videos.filter((v) => v.series === "objetivo-dakar");
  const realVideos = channel.videos.filter((v) => !isPlaceholder(v)).slice(0, 8);
  return (
    <>
      <JsonLd data={personLd()} />
      {realVideos.length > 0 && <JsonLd data={videoListLd(realVideos)} />}
      <HomeHero />
      <Intro />
      <section className="bg-midnight py-12 lg:py-20" aria-label="Tienda">
        <Container>
          <PromoBanner />
        </Container>
      </section>
      <TheCar />
      <DakarSection episodes={episodes} />
      {channel.live && <LatestVideos data={channel} />}
      <ShopSection products={products} />
      <NewsSection articles={articles} />
      <Worlds />
      <PartnersSection />
    </>
  );
}
