export const config = {
  obsidian: {
    publicUrl: process.env.NEXT_PUBLIG_OBSIDIAN_PUBLIC_URL!,
  },
};

export const serverConfig = {
  obsidian: {
    publishSiteId: process.env.OBSIDIAN_PUBLISH_SITE_ID!,
    blogTag: process.env.OBSIDIAN_BLOG_TAG!,
    stripSuffixes: process.env.OBSIDIAN_STRIP_SUFFIXES!.split(','),
    cv: process.env.OBSIDIAN_CV!,
  }
};