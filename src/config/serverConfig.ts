export default {
  obsidian: {
    publishSiteId: process.env.OBSIDIAN_PUBLISH_SITE_ID!,
    blogTag: process.env.OBSIDIAN_BLOG_TAG!,
    stripSuffixes: process.env.OBSIDIAN_STRIP_SUFFIXES!.split(','),
    cv: process.env.OBSIDIAN_CV!,
  }
};