import { Markdown, Page, CvSummaryEntry, PressPhotoChooser } from '@/components';
import clientConfig from '@/config/clientConfig';
import serverConfig from '@/config/serverConfig';
import { Rfc } from '@/utils';
import { Cv } from '@/utils/cv';
import { Box, Container, Grid, Heading, Image, useColorModeValue } from '@chakra-ui/react';
import { DateTime } from 'luxon';
import { GetStaticProps } from 'next';

const CHECK_TAG = `#${clientConfig.obsidian.blogTag}`;

export interface IndexProps {
  cv: Cv,
  rfcs: Rfc[],
}

export default function Index({ rfcs, cv }: IndexProps) {
  const light = useColorModeValue('gray.400', 'whiteAlpha.400');

  return (
    <Page>
      <Container maxW="container.lg" mt={8} mb={8}>
        <Image src="https://u.tyler.vc/blog-images/index.jpg" w="100%" alt="" mb={8} />
        <Grid templateColumns={{ base: '1fr', md: '12fr 5fr' }} gap={8} mb={8}>
          <Box>
            {cv.bio && <Markdown content={cv.bio} />}

            <Box mt={6}>
              <Heading as="h2" fontSize="xl" mb={2}>Press Photos</Heading>
              <PressPhotoChooser
                templateColumns={{ base: `repeat(4, 1fr)`, md: `repeat(8, 1fr)` }}
                photos={[
                  { image: '/press-photos/press_0_sm.jpg', url: '/press-photos/press_0.jpg', credit: 'Erin Sylvester' },
                  { image: '/press-photos/press_1_sm.jpg', url: '/press-photos/press_1.jpg', credit: 'Erin Sylvester' },
                  { image: '/press-photos/press_2_sm.jpg', url: '/press-photos/press_2.jpg', credit: 'Amelia Bertozzi-Villa' },
                  { image: '/press-photos/press_3_sm.jpg', url: '/press-photos/press_3.jpg', credit: 'Amelia Bertozzi-Villa' },
                ]}
              />
            </Box>
          </Box>
          <Box>
            <Heading as="h2" fontSize="xl" mb={2}>Essays &amp; RFCs</Heading>
            {rfcs.filter(r => !r.unlisted).map(e => (
              <CvSummaryEntry
                key={e.slug}
                url={e.slug}
                title={e.title}
                date={e.createdAt}
                info={e.tags?.[0]}
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
                recommended={e.recommended}
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
                recommended={e.recommended}
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
                recommended={e.recommended}
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
  const [cv, rfcs] = await Promise.all([
    await fetch('https://svc.tyler.vc/cv.json').then(r => r.json()),
    await fetch('https://svc.tyler.vc/rfcs.json').then(r => r.json()),
  ]);

  return {
    props: {
      rfcs,
      cv,
    },
    revalidate: 300,
  };
}