import fetch from 'cross-fetch';
import { ObsidianCache } from './Cache';
const API_BASE = `https://publish-01.obsidian.md`;

export async function obsidianFetchCache(siteId: string): Promise<ObsidianCache> {
    const response = await fetch(`${API_BASE}/cache/${siteId}`);
    return <Promise<ObsidianCache>> response.json();
}

export async function obsidianFetch(siteId: string, slug: string): Promise<string> {
    const response = await fetch(`${API_BASE}/access/${siteId}/${slug}`);
    return response.text();
}