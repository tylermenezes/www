import { stripTitle } from './title';

export function makeWebSlug(originalSlug: string): string {

  return stripTitle(originalSlug)
    .toLowerCase()
    .replace(/  +/g, ' ')
    .replace(/ /g, '-');
}

type ObjAddSlugReturnType<T, U> = T & Record<string, U & { slug: string }>;

export function objAddSlugs
  <U extends Record<string, any>, T extends Record<string, U | undefined>>(
    obj: T
  ): ObjAddSlugReturnType<T, U> {
  return <ObjAddSlugReturnType<T, U>> Object.keys(obj)
    .reduce(
      (accum: Partial<ObjAddSlugReturnType<T, U>>, k: string) => ({
        ...accum,
        [k]: {
          ...obj[k],
          slug: makeWebSlug(k),
        }
      }),
      {}
    );
}