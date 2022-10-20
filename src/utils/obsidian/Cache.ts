import { ObsidianTag } from './Tag';
import { ObsidianHeading } from './Heading';
import { ObsidianFrontmatter } from './Frontmatter';
import { ObsidianLink } from './Link';

export interface ObsidianCacheEntry {
    tags?: ObsidianTag[]
    headings?: ObsidianHeading[]
    frontmatter?: ObsidianFrontmatter
    links?: ObsidianLink[]
};

export interface ObsidianCache {
    [key: string]: ObsidianCacheEntry | undefined
};