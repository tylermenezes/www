import fetch from 'cross-fetch';
import randomWords from 'random-words';
import { ObsidianCache } from './Cache';

const API_BASE = `https://publish-01.obsidian.md`;
const TLDS = ['com', 'com', 'com', 'net', 'org', 'co.uk'];

function randomOrigin(): string {
  return [
    randomWords({ min: 2, max: 5, join: '' }),
    TLDS[Math.floor(Math.random() * TLDS.length)],    
  ].join('.');
}

export async function obsidianFetchCache(siteId: string): Promise<ObsidianCache> {
  const response = await fetch(
    `${API_BASE}/cache/${siteId}`,
    { headers: { Origin: randomOrigin() } },
  );
  return <Promise<ObsidianCache>> response.json();
}

export async function obsidianFetch(siteId: string, slug: string): Promise<string> {
  const response = await fetch(
    `${API_BASE}/access/${siteId}/${slug}`,
    { headers: { Origin: randomOrigin() } },
  );
  return response.text();
}