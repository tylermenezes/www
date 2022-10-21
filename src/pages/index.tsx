import { Markdown, Page } from '@/components';
import clientConfig from '@/config/clientConfig';
import serverConfig from '@/config/serverConfig';
import { Cv, fetchCv, objAddSlugs, ObsidianCache, obsidianFetchCache, obsidianFilterCacheByTag, stripTitle, WithSlugs } from '@/utils';
import { Box, Container, Grid, Heading, Image, Link, Text, useColorModeValue } from '@chakra-ui/react';
import { DateTime } from 'luxon';
import { GetStaticProps } from 'next';

const CHECK_TAG = `#${clientConfig.obsidian.blogTag}`;

export interface IndexProps {
  cache: WithSlugs<ObsidianCache, Record<string, any>>
  cv: Cv
}

export default function Index({ cache, cv }: IndexProps) {
  const light = useColorModeValue('gray.400', 'whiteAlpha.400');

  return (
    <Page credits="Header photo © Amelia Bertozzi-Villa.">
      <Container maxW="container.lg" mt={8} mb={8}>
        <Image src="https://u.tyler.vc/blog-images/index.jpg" w="100%" alt="" mb={8} />
        <Grid templateColumns={{ base: '1fr', md: '12fr 5fr' }} gap={8} mb={8}>
          <Box>{cv.bio && <Markdown content={cv.bio} />}</Box>
          <Box>
            <Heading as="h2" fontSize="xl" mb={2}>Essays/Blog Posts</Heading>
            {Object.values(cache)
              .filter(e => e.headings && e.headings.length > 0)
              .map(e => ({ ...e, tags: e.tags?.filter(t => t.tag !== CHECK_TAG)}))
              .map(e => (
                <Box as="a" href={e.slug} key={e.slug} mb={2} display="block">
                  <Link as="div">{stripTitle(e.headings![0].heading)}</Link>
                  <Text fontSize="sm" fontFamily="monospace" color={light}>
                  {
                    [
                      e.tags?.[0] && e.tags[0].tag[1].toUpperCase() + e.tags[0].tag.slice(2),
                      e.frontmatter?.date && DateTime.fromISO(e.frontmatter.date).toLocaleString(DateTime.DATE_FULL)
                    ].filter(Boolean).join(', ')
                  }
                  </Text>
                </Box>
              ))
            }
          </Box>
        </Grid>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8}>
          <Box>
            <Heading as="h2" fontSize="xl" mb={2}>Publications</Heading>
            {cv.publications.map(e => (
              <Box as="a" href={e.url!} target="_blank" key={e.url} mb={2} display="block">
                <Link as="div" fontSize="sm" lineHeight={1.3} display="inline-block">{e.title}</Link>
                <Text fontSize="sm" color={light} fontFamily="monospace" mt={-1}>
                  {[e.conference, e.date ? DateTime.fromISO(e.date).toLocaleString(DateTime.DATE_FULL) : null].filter(Boolean).join(', ')}
                </Text>
              </Box>
            ))}
          </Box>
          <Box>
            <Heading as="h2" fontSize="xl" mb={2}>Press</Heading>
            {cv.press.map(e => (
              <Box as="a" href={e.url!} target="_blank" key={e.url} mb={2} display="block">
                <Link as="div" fontSize="sm" lineHeight={1.3} display="inline-block">{e.title}</Link>
                <Text fontSize="sm" color={light} fontFamily="monospace" mt={-1}>
                  {[e.outlet, e.date ? DateTime.fromISO(e.date).toLocaleString(DateTime.DATE_FULL) : null].filter(Boolean).join(', ')}
                </Text>
              </Box>
            ))}
          </Box>
          <Box>
            <Heading as="h2" fontSize="xl" mb={2}>Press Photos</Heading>
            <Grid templateColumns="repeat(3, 1fr)" gap={2}>
              {[1, 2, 3, 4, 5].map((e, i) => (
                <a href={`/press-photos/press_${e}.jpg`} target="_blank" key={e}>
                  <Image src={`/press-photos/press_${e}_sm.jpg`} alt={`Press photo ${i}.`} />
                </a>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Container>
    </Page>
  )
}

export const getStaticProps: GetStaticProps = async () => {
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
    revalidate: 300,
  };
}