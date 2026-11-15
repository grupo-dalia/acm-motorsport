import type { Metadata } from "next";
import { ManualPartPage, partMetadata, partParams } from "@/components/manual/manual-part-page";
import { pajeroManual } from "@/content/manual-defs";

type Props = { params: Promise<{ pieza: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => partParams(pajeroManual);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return partMetadata(pajeroManual, (await params).pieza);
}

export default async function Page({ params }: Props) {
  return <ManualPartPage manual={pajeroManual} id={(await params).pieza} />;
}
