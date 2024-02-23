import { stripTitle } from './title';

export function makeWebSlug(originalSlug: string): string {
  const fileName = originalSlug.split('/').slice(-1)[0];
  return stripTitle(fileName)
    .toLowerCase()
    .replace(/  +/g, ' ')
    .replace(/ /g, '-');
}

export type WithSlugs<T, U> = T & Record<string, U & { slug: string }>;

export function objAddSlugs
  <U extends Record<string, any>, T extends Record<string, U | undefined>>(
    obj: T
  ): WithSlugs<T, U> {
  return <WithSlugs<T, U>> Object.keys(obj)
    .reduce(
      (accum: Partial<WithSlugs<T, U>>, k: string) => ({
        ...accum,
        [k]: {
          ...obj[k],
          slug: makeWebSlug(k),
        }
      }),
      {}
    );
}