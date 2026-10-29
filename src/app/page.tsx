import { HomeHero, Intro, TheCar, DakarSection, LatestVideos, ShopSection, Worlds, PartnersSection } from "@/components/sections/home";
import { getChannelVideos, isPlaceholder } from "@/lib/youtube";
import { catalog } from "@/integrations/commerce";
import { JsonLd, personLd, videoListLd } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const metadata = { alternates: { canonical: absoluteUrl("/") } };
export const revalidate = 3600; // vídeos de YouTube: se refrescan cada hora

export default async function HomePage() {
  const [products, channel] = await Promise.all([catalog.listProducts().then((all) => all.filter((p) => p.featured)), getChannelVideos()]);
  const episodes = channel.videos.filter((v) => v.series === "objetivo-dakar");
  const realVideos = channel.videos.filter((v) => !isPlaceholder(v)).slice(0, 8);
  return (
    <>
      <JsonLd data={personLd()} />
      {realVideos.length > 0 && <JsonLd data={videoListLd(realVideos)} />}
      <HomeHero />
      <Intro />
      <TheCar />
      <DakarSection episodes={episodes} />
      {channel.live && <LatestVideos data={channel} />}
      <ShopSection products={products} />
      <Worlds />
      <PartnersSection />
    </>
  );
}
