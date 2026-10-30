import type { Metadata } from "next";

export const metadata: Metadata = { title: "Panel", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="on-paper min-h-[80vh] pb-24 pt-28 lg:pt-32">{children}</div>;
}
