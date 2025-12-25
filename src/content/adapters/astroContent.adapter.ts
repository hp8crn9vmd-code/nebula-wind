import type { ContentAdapter } from "./adapter";
import type { AdapterHealth, ContentItem, ContentKind, ContentMeta } from "./types";

type UnknownRecord = Record<string, unknown>;

function isRecord(v: unknown): v is UnknownRecord {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isFunction(v: unknown): v is (...args: unknown[]) => unknown {
  return typeof v === "function";
}

function asBoolean(v: unknown): boolean | undefined {
  return typeof v === "boolean" ? v : undefined;
}

function asNumber(v: unknown): number | undefined {
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}

function asStringArray(v: unknown): string[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out = v.filter((x): x is string => typeof x === "string");
  return out.length ? out : undefined;
}

function isoOrUndefined(v: unknown): string | undefined {
  if (v instanceof Date) {
    const t = v.getTime();
    return Number.isFinite(t) ? v.toISOString() : undefined;
  }
  if (typeof v === "string" || typeof v === "number") {
    const d = new Date(v);
    const t = d.getTime();
    return Number.isFinite(t) ? d.toISOString() : undefined;
  }
  return undefined;
}

function buildMeta(dataLike: unknown): ContentMeta {
  const data: UnknownRecord = isRecord(dataLike) ? dataLike : {};

  const date = isoOrUndefined(data["date"]);
  const updated = isoOrUndefined(data["updated"]);
  const tags = asStringArray(data["tags"]);
  const readingTime = asNumber(data["readingTime"]);
  const draft = asBoolean(data["draft"]);

  return {
    ...(typeof data["title"] === "string" ? { title: data["title"] } : {}),
    ...(typeof data["description"] === "string" ? { description: data["description"] } : {}),
    ...(date ? { date } : {}),
    ...(updated ? { updated } : {}),
    ...(tags ? { tags } : {}),
    ...(draft !== undefined ? { draft } : {}),
    ...(readingTime !== undefined ? { readingTime } : {}),
  };
}

function asContentItem(kind: ContentKind, entry: unknown, fallbackSlug?: string): ContentItem {
  const rec: UnknownRecord = isRecord(entry) ? entry : {};
  const slug = typeof rec["slug"] === "string" ? rec["slug"] : (fallbackSlug ?? "");
  const body = typeof rec["body"] === "string" ? rec["body"] : "";
  const meta = buildMeta(rec["data"]);
  const raw = rec["data"]; // نحفظ raw frontmatter/fields (unknown)

  return {
    kind,
    slug: String(slug),
    meta,
    body,
    ...(raw !== undefined ? { raw } : {}),
  };
}

async function loadAstroContentModule(): Promise<unknown> {
  // virtual module provided by Astro
  return import("astro:content");
}

/**
 * Astro Content Adapter
 * - currently maps ContentKind.article -> Astro "blog" collection
 * - other kinds are safe no-op until we add collections/docs later
 */
export const astroContentAdapter: ContentAdapter = {
  name: "astro:content",

  async health(): Promise<AdapterHealth> {
    try {
      const mod = await loadAstroContentModule();
      const ok = isRecord(mod) && (isFunction(mod["getCollection"]) || isFunction(mod["getEntry"]));
      return {
        name: "astro:content",
        ok,
        details: ok ? "astro:content module available" : "astro:content missing getCollection/getEntry",
      };
    } catch (e: unknown) {
      return {
        name: "astro:content",
        ok: false,
        details: e instanceof Error ? e.message : "unknown error",
      };
    }
  },

  async list(kind: ContentKind): Promise<ContentItem[]> {
    // Only 'article' is implemented for now
    if (kind !== "article") return [];

    const mod = await loadAstroContentModule();
    const modRec: UnknownRecord = isRecord(mod) ? mod : {};

    const fn = modRec["getCollection"];
    if (!isFunction(fn)) return [];

    const getCollection = fn as (name: string) => Promise<unknown[]>;
    const entries = await getCollection("blog");

    return entries
      .map((e) => asContentItem(kind, e))
      .filter((x) => x.slug.length > 0);
  },

  async get(kind: ContentKind, slug: string): Promise<ContentItem | null> {
    if (kind !== "article") return null;

    const mod = await loadAstroContentModule();
    const modRec: UnknownRecord = isRecord(mod) ? mod : {};

    const fn = modRec["getEntry"];
    if (!isFunction(fn)) return null;

    const getEntry = fn as (name: string, slug: string) => Promise<unknown>;
    const entry = await getEntry("blog", slug);

    const item = asContentItem(kind, entry, slug);
    return item.slug ? item : null;
  },
};
