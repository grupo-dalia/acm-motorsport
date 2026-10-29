import { describe, expect, it } from "vitest";
import { assignEpisodes, episodeNumber } from "./series";
import type { SeasonConfig } from "@/content/series";
import type { YtVideo } from "./youtube";

const cfg: SeasonConfig = { number: 1, year: 2026, title: "t", synopsis: "s", status: "emision", totalEpisodes: 10, releasedThrough: 7, episodes: {} };
const v = (id: string, title: string, date: string): YtVideo => ({ id, title, description: "", publishedAt: date, views: 1, thumbnail: "x", series: "objetivo-dakar", kind: "video" });

describe("series", () => {
  it("detecta el número de capítulo en el título", () => {
    expect(episodeNumber("Objetivo Dakar T1E3 · La Garrotxa")).toBe(3);
    expect(episodeNumber("Capítulo 5: el tripmaster")).toBe(5);
    expect(episodeNumber("Ep. 2 regularidad")).toBe(2);
    expect(episodeNumber("Starlink Mini en el techo")).toBeNull();
  });
  it("coloca numerados en su sitio, rellena por fecha y deja 8-10 próximamente", () => {
    const eps = assignEpisodes(cfg, [v("aaaaaaaaaaa", "T1E3 Garrotxa", "2026-05-01"), v("bbbbbbbbbbb", "Primer vídeo", "2026-01-01"), v("ccccccccccc", "Segundo", "2026-02-01")]);
    expect(eps).toHaveLength(10);
    expect(eps[2]!.youtubeId).toBe("aaaaaaaaaaa");
    expect(eps[0]!.youtubeId).toBe("bbbbbbbbbbb");
    expect(eps[1]!.youtubeId).toBe("ccccccccccc");
    expect(eps.slice(7).every((e) => e.status === "proximamente" && e.youtubeId === null)).toBe(true);
    expect(eps[6]!.status).toBe("disponible");
  });
});
