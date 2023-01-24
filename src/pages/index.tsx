import { Markdown, Page, CvSummaryEntry } from '@/components';
import clientConfig from '@/config/clientConfig';
import serverConfig from '@/config/serverConfig';
import { Cv, fetchCv, objAddSlugs, ObsidianCache, obsidianFetchCache, obsidianFilterCacheByTag, stripTitle, titleCase, WithSlugs } from '@/utils';
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

  const blogPosts = Object.values(cache)
    .filter(e => e.headings && e.headings.length > 0)
    .map(e => ({ ...e, tags: e.tags?.filter(t => t.tag !== CHECK_TAG) })) // Remove blog from tag list.
    .map(e => ({
      ...e,
      primaryTag: e.tags?.[0] ? titleCase(e.tags[0].tag.substring(1)) : null,
      date: e.frontmatter?.date,
      luxonDate: e.frontmatter?.date && DateTime.fromISO(e.frontmatter?.date),
    }))
    .sort((a, b) => {
      if (!a.luxonDate) return -1;
      if (!b.luxonDate) return 1;
      return (a.luxonDate > b.luxonDate) ? -1 : 1;
    })

  return (
    <Page credits="Header photo © Amelia Bertozzi-Villa.">
      <Container maxW="container.lg" mt={8} mb={8}>
        <Image src="https://u.tyler.vc/blog-images/index.jpg" w="100%" alt="" mb={8} />
        <Grid templateColumns={{ base: '1fr', md: '12fr 5fr' }} gap={8} mb={8}>
          <Box>
            {cv.bio && <Markdown content={cv.bio} />}

            <Box mt={6}>
              <Heading as="h2" fontSize="xl" mb={2}>Press Photos</Heading>
              <Grid templateColumns="repeat(8, 1fr)" gap={2}>
                {[0, 1, 2, 3, 4, 5].map((e, i) => (
                  <a href={`/press-photos/press_${e}.jpg`} target="_blank" key={e}>
                    <Image src={`/press-photos/press_${e}_sm.jpg`} alt={`Press photo ${i}.`} />
                  </a>
                ))}
              </Grid>
            </Box>
          </Box>
          <Box>
            <Heading as="h2" fontSize="xl" mb={2}>Essays &amp; Blog Posts</Heading>
            {blogPosts.map(e => (
              <CvSummaryEntry
                key={e.slug}
                url={e.slug}
                title={stripTitle(e.headings![0].heading)}
                date={e.date}
                info={e.primaryTag}
                fontSize="lg"
                target="_self"
              />
            ))}
          </Box>
        </Grid>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8}>
          <Box>
            <Heading as="h2" fontSize="xl" mb={2}>Talks &amp; Interviews</Heading>
            {cv.talksInterviews.map(e => (
              <CvSummaryEntry
                key={e.title}
                title={e.title}
                url={e.url}
                info={e.venue}
                date={e.date}
                fontSize={{ base: 'lg', md: 'md'}}
              />
            ))}
          </Box>
          <Box>
            <Heading as="h2" fontSize="xl" mb={2}>Press</Heading>
            {cv.press.map(e => (
              <CvSummaryEntry
                key={e.title}
                title={e.title}
                url={e.url}
                info={e.outlet}
                date={e.date}
                fontSize={{ base: 'lg', md: 'md'}}
              />
            ))}
          </Box>
          <Box>
            <Heading as="h2" fontSize="xl" mb={2}>Publications</Heading>
            {cv.publications.map(e => (
              <CvSummaryEntry
                key={e.title}
                title={e.title}
                url={e.url}
                info={e.conference}
                date={e.date}
                fontSize={{ base: 'lg', md: 'md'}}
              />
            ))}
          </Box>
        </Grid>
      </Container>
    </Page>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const [cv, cacheRaw] = await Promise.all([fetchCv(), obsidianFetchCache(serverConfig.obsidian.publishSiteId)]);
  const cache = obsidianFilterCacheByTag(objAddSlugs(cacheRaw), CHECK_TAG);

  return {
    props: {
      cache,
      cv,
    },
    revalidate: 300,
  };
}