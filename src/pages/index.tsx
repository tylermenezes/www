import { Markdown, Page } from '@/components';
import clientConfig from '@/config/clientConfig';
import serverConfig from '@/config/serverConfig';
import { Cv, fetchCv, objAddSlugs, ObsidianCache, obsidianFetchCache, obsidianFilterCacheByTag, stripTitle, WithSlugs } from '@/utils';
import { Box, Container, Grid, Heading, Image, Link, Text } from '@chakra-ui/react';
import { DateTime } from 'luxon';
import { GetStaticProps } from 'next';

const CHECK_TAG = `#${clientConfig.obsidian.blogTag}`;

export interface IndexProps {
  cache: WithSlugs<ObsidianCache, Record<string, any>>
  cv: Cv
}

export default function Index({ cache, cv }: IndexProps) {
  return (
    <Page credits="Header photo © Amelia Bertozzi-Villa.">
      <Container maxW="container.lg" mt={8} mb={8}>
        <Image src="https://u.tyler.vc/blog-images/index.jpg" w="100%" alt="" />
      </Container>
      <Container maxW="container.md" mb={8}>
        {cv.bio && <Markdown content={cv.bio} />}
      </Container>
      <Container maxW="container.lg">
        <Grid templateColumns={{ base: '1fr', lg: 'repeat(3, 1fr)' }} gap={8}>
          <Box>
            <Heading as="h2" fontSize="xl" mb={2}>Essays/Blog Posts</Heading>
            {Object.values(cache).map(e => e.headings && e.headings.length > 0 && (
              <Box key={e.slug} mb={2}>
                <Link href={e.slug}>{stripTitle(e.headings[0].heading)}</Link>
                {e.frontmatter?.date && (
                  <Text fontSize="sm">{DateTime.fromISO(e.frontmatter.date).toLocaleString(DateTime.DATE_FULL)}</Text>
                )}
              </Box>
            ))}
          </Box>
          <Box>
            <Heading as="h2" fontSize="xl" mb={2}>Publications</Heading>
            {cv.publications.map(e => (
              <Box key={e.url} mb={2}>
                <Link href={e.url!} target="_blank">{e.title}</Link>
                <Text fontSize="sm">
                  {[e.conference, e.date ? DateTime.fromISO(e.date).toLocaleString(DateTime.DATE_FULL) : null].filter(Boolean).join(', ')}
                </Text>
              </Box>
            ))}
          </Box>
          <Box>
            <Heading as="h2" fontSize="xl" mb={2}>Press</Heading>
            {cv.press.map(e => (
              <Box key={e.url} mb={2}>
                <Link href={e.url!} target="_blank">{e.title}</Link>
                <Text fontSize="sm">
                  {[e.outlet, e.date ? DateTime.fromISO(e.date).toLocaleString(DateTime.DATE_FULL) : null].filter(Boolean).join(', ')}
                </Text>
              </Box>
            ))}
          </Box>
        </Grid>
      </Container>
    </Page>
  )
}

export const getStaticProps: GetStaticProps<IndexProps> = async () => {
  const cv = await fetchCv();
  const cache = obsidianFilterCacheByTag(
    objAddSlugs(
      await obsidianFetchCache(serverConfig.obsidian.publishSiteId)
    ),
    CHECK_TAG
  );

  return {
    props: {
      cache,
      cv,
    },
  };
}