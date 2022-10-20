import serverConfig from '@/config/serverConfig';
import { escapeRegex } from '../regex';

export function stripTitle(title: string) {
  const stripRegexInner = serverConfig.obsidian.stripSuffixes
    .map(s => escapeRegex(s.toLowerCase()))
    .join('|');
  const stripRegex = new RegExp(`(${stripRegexInner})$`, 'i');

  return title
    .replace(/\.md$/, '')
    .replace(stripRegex, '')
    .trim();
}