import type { Metadata } from "next";
import { ManualPartPage, partMetadata, partParams } from "@/components/manual/manual-part-page";
import { nivaManual } from "@/content/manual-defs";

type Props = { params: Promise<{ pieza: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => partParams(nivaManual);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return partMetadata(nivaManual, (await params).pieza);
}

export default async function Page({ params }: Props) {
  return <ManualPartPage manual={nivaManual} id={(await params).pieza} />;
}
