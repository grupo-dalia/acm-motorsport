import { ImageResponse } from "next/og";
import { catalog } from "@/integrations/commerce";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Vista previa del Black Friday (1200×630) para WhatsApp, Instagram, etc.
 * Fondo y sello de marca en public/og/; la camiseta Más Gas sale de la foto de Printful,
 * así que si cambia el diseño, la imagen se actualiza sola.
 */
export const revalidate = 3600;

const SLUG = "camiseta-mas-gas-menos-drama";

const dataUrl = async (file: string, mime: string) => `data:${mime};base64,${(await readFile(join(process.cwd(), "public/og", file))).toString("base64")}`;

export async function GET() {
  const [bg, seal, product] = await Promise.all([
    dataUrl("black-friday-2026-fondo.jpg", "image/jpeg"),
    dataUrl("black-friday-2026-sello.png", "image/png"),
    catalog.getProductBySlug(SLUG).catch(() => null),
  ]);
  const shirt = product?.images ? Object.values(product.images)[0]?.[0] : undefined;

  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, display: "flex", position: "relative" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse solo admite <img> */}
        <img src={bg} width={1200} height={630} alt="" style={{ position: "absolute", left: 0, top: 0 }} />
        {shirt && (
          <div
            style={{
              position: "absolute",
              left: 700,
              top: 92,
              width: 400,
              height: 440,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#ffffff",
              borderRadius: 26,
              border: "5px solid #e3141e",
              transform: "rotate(3deg)",
              boxShadow: "0 24px 50px rgba(0,0,0,0.5)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse solo admite <img> */}
            <img src={shirt} width={380} height={380} alt="" style={{ objectFit: "contain" }} />
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse solo admite <img> */}
        <img src={seal} width={200} height={200} alt="" style={{ position: "absolute", left: 985, top: 20 }} />
      </div>
    ),
    { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600" } },
  );
}
