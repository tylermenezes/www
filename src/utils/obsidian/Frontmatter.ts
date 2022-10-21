import { ObsidianPos } from './Pos';

export interface ObsidianFrontmatter {
    pos: ObsidianPos
    publish?: boolean
    date?: string
    updated?: string
    image?: string
    credits?: string
    [key: string]: any
};