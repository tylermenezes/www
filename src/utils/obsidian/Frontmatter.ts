import { ObsidianPos } from './Pos';

export interface ObsidianFrontmatter {
    pos: ObsidianPos
    publish?: boolean
    date?: string
    updated?: string
    [key: string]: any
};