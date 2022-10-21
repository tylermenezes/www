export default {
  obsidian: {
    publicUrl: process.env.NEXT_PUBLIC_OBSIDIAN_PUBLIC_URL!,
    blogTag: process.env.NEXT_PUBLIC_OBSIDIAN_BLOG_TAG!,
    stripSuffixes: process.env.NEXT_PUBLIC_OBSIDIAN_STRIP_SUFFIXES!.split(','),
    cv: process.env.NEXT_PUBLIC_OBSIDIAN_CV!,
  },
};