import type { Metadata } from "next";
import { ManualPartPage, partMetadata, partParams } from "@/components/manual/manual-part-page";
import { pajeroManualEn } from "@/content/manual-defs";

type Props = { params: Promise<{ pieza: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => partParams(pajeroManualEn);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meta = partMetadata(pajeroManualEn, (await params).pieza);
  return { ...meta, openGraph: { ...meta.openGraph, images: ["/guias/manual-pajero-iii/opengraph-image"] }, twitter: { ...meta.twitter, images: ["/guias/manual-pajero-iii/twitter-image"] } };
}

export default async function Page({ params }: Props) {
  return <ManualPartPage manual={pajeroManualEn} id={(await params).pieza} />;
}
