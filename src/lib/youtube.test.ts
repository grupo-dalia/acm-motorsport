import { describe, expect, it } from "vitest";
import { classify, parseFeed } from "./youtube";

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
 <title>Andres Cubero Moreno</title>
 <entry>
  <id>yt:video:abcdefghijk</id>
  <yt:videoId>abcdefghijk</yt:videoId>
  <title>Qué es un rally de regularidad &amp; cómo se gana</title>
  <published>2026-10-12T18:00:00+00:00</published>
  <media:group>
   <media:title>Qué es un rally de regularidad</media:title>
   <media:description>Explicación completa</media:description>
   <media:community><media:starRating count="120" average="5.00" min="1" max="5"/><media:statistics views="15432"/></media:community>
  </media:group>
 </entry>
 <entry>
  <yt:videoId>ZYXWVUTSRQP</yt:videoId>
  <title>Cómo instalar Starlink Mini en tu coche</title>
  <published>2026-09-01T18:00:00+00:00</published>
  <media:group><media:description></media:description><media:community><media:statistics views="0"/></media:community></media:group>
 </entry>
 <entry><yt:videoId>malo</yt:videoId><title>roto</title></entry>
</feed>`;

describe("youtube feed", () => {
  it("parsea id, título decodificado, fecha y visualizaciones", () => {
    const v = parseFeed(feed);
    expect(v).toHaveLength(2);
    expect(v[0]).toMatchObject({ id: "abcdefghijk", title: "Qué es un rally de regularidad & cómo se gana", views: 15432, publishedAt: "2026-10-12T18:00:00+00:00" });
    expect(v[0]!.thumbnail).toContain("abcdefghijk");
  });
  it("clasifica por palabras clave sin importar acentos", () => {
    expect(classify("Qué es un RALLY de regularidad")).toBe("objetivo-dakar");
    expect(classify("Cómo instalar Starlink Mini")).toBe("workshop");
    expect(classify("Mi cockpit de simulación")).toBe("sim-racing");
    expect(classify("Vlog de verano")).toBe("general");
  });
});
