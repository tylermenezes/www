import { GetStaticProps, GetStaticPaths } from 'next';
import { DateTime } from 'luxon';
import { Box, Container, Heading, Image, Link, Text, useColorModeValue } from '@chakra-ui/react';
import clientConfig from '@/config/clientConfig';
import serverConfig from '@/config/serverConfig';
import {
  obsidianFetch,
  obsidianFetchCache,
  obsidianFilterCacheByTag,
  objAddSlugs,
  filterGetKeys,
  makeWebSlug,
  ObsidianFrontmatter,
  stripTitle
} from '@/utils';
import { Page, Markdown } from '@/components';

const CHECK_TAG = `#${clientConfig.obsidian.blogTag}`;

interface BlogPostProps {
  title: string
  slug: string
  tags: string[]
  frontmatter: ObsidianFrontmatter | Record<string, any>
  content: string
}

export default function BlogPost({ title, slug, tags, frontmatter, content }: BlogPostProps) {
  const light = useColorModeValue('gray.600', 'whiteAlpha.500');
  const bg = useColorModeValue('white', 'black');

  return (
    <Page title={title} credits={frontmatter.credits}>
      <Container maxW="container.md">

        <Box mt={frontmatter.image ? 2 : 8} mb={8}>
          {frontmatter.image && (
            <Image src={frontmatter.image} w="100%" alt="" mb={{ base: -6, md: -8, lg: -12 }} />
          )}
          <Box ml={frontmatter.image ? 4 : 0}>
            <Heading
              as="h1"
              mb={2}
              fontSize={{ base: '4xl', md: '5xl', xl: '6xl' }}
              backgroundColor={bg}
              display="inline"
              pl={frontmatter.image ? 2 : 0}
              pr={frontmatter.image ? 2 : 0}
              position="relative"
              zIndex={500}
              boxDecorationBreak="clone"
              lineHeight={1.3}
            >
              {title}
            </Heading>
            {frontmatter.date && (
              <Text color={light} fontFamily="monospace" fontWeight="bold" fontSize="sm" pl={frontmatter.image ? 2 : 0}>
                Published {DateTime.fromISO(frontmatter.date).toLocaleString(DateTime.DATE_FULL)}{
                  frontmatter.updated ? `; last updated ${DateTime.fromISO(frontmatter.updated).toLocaleString(DateTime.DATE_FULL)}` : ''
                }.
              </Text>
            )}
            {tags && tags.length > 0 && (
              <Text color={light} fontFamily="monospace" fontWeight="bold" fontSize="sm" pl={frontmatter.image ? 2 : 0}>
                Tags: {tags.map(t => <Link key={t} mr={2} href={`/tag/${t}`}>#{t}</Link>)}
              </Text>
            )}
          </Box>
        </Box>

        <Markdown content={content} />
      </Container>
    </Page>
  );
}

export const getStaticProps: GetStaticProps<BlogPostProps> = async ({ params }) => {
  if (!params?.blog || typeof params.blog !== 'string') return { notFound: true };
  const slug: string = params.blog;

  const cache = obsidianFilterCacheByTag(
    objAddSlugs(
      await obsidianFetchCache(serverConfig.obsidian.publishSiteId)
    ),
    CHECK_TAG
  );

  const pageKey = filterGetKeys(cache, (v: any) => v.slug === slug)[0];
  if (!pageKey) return { notFound: true };

  const cacheEntry = cache[pageKey]!;
  const content = await obsidianFetch(serverConfig.obsidian.publishSiteId, pageKey);
  const cleanedContent = content
      .split(`\n`)
      .filter(line => !(line.startsWith('# ') || line.startsWith('Tags: ')))
      .join(`\n`);

  return {
    props: {
      title: stripTitle(cacheEntry.headings?.[0]?.heading || pageKey),
      slug,
      tags: cacheEntry.tags!.map(t => t.tag.slice(1)).filter(t => t !== clientConfig.obsidian.blogTag),
      frontmatter: cacheEntry.frontmatter || {},
      content: cleanedContent,
    },
    revalidate: 300,
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const cache = await obsidianFetchCache(serverConfig.obsidian.publishSiteId);
  const blogCache = obsidianFilterCacheByTag(cache, CHECK_TAG);
  const blogSlugs = Object.keys(blogCache).map(k => makeWebSlug(k));

  return {
    paths: blogSlugs.map(slug => ({ params: { blog: slug } })),
    fallback: 'blocking',
  };
}