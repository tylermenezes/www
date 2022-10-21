import { ObsidianPos } from './Pos';

export interface ObsidianFrontmatter {
    pos: ObsidianPos
    publish?: boolean
    date?: string
    updated?: string
    image?: string
    [key: string]: any
};