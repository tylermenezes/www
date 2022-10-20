import { ObsidianCache, ObsidianCacheEntry } from "./Cache";
import { ObsidianTag } from "./Tag";

export function obsidianFilterCacheByTag(cache: ObsidianCache, tag: string): ObsidianCache {
    const slugs = Object.keys(cache);
    const filteredKeys = slugs
        .filter((k: keyof ObsidianCache) => {
            const cacheEntry = cache[k];
            return cacheEntry?.tags?.map(t => t.tag).includes(tag);
        });
    return filteredKeys
        .reduce(
            (accum: ObsidianCache, k: keyof ObsidianCache) => ({ ...accum, [k]: cache[k] }),
            {}
        );
}

export function obsidianCacheEntryHasTag<S extends string>(
    cache: ObsidianCache, slug: S, tag: string
): cache is ObsidianCache & Record<S, ObsidianCacheEntry & Required<Pick<ObsidianCacheEntry, 'tags'>>> {
    return Boolean(
        cache[slug]?.tags
        && cache[slug]!.tags!.map(t => t.tag).includes(tag)
    );
}