import { Markdown, Page, CvSummaryEntry, PressPhotoChooser, MusicPreview, SmallSubheading } from '@/components';
import { TravelMap } from '@/components/TravelMap';
import clientConfig from '@/config/clientConfig';
import { Rfc, Music, Trip } from '@/utils';
import { Cv, CvList } from '@/utils/cv';
import { Box, Container, Divider, Grid, Heading, Image, Link, useColorModeValue } from '@chakra-ui/react';
import { GetStaticProps } from 'next';

const CHECK_TAG = `#${clientConfig.obsidian.blogTag}`;

export interface IndexProps {
  cv: Cv,
  rfcs: Rfc[],
  music: Music,
  trips: Trip[],
}

function sortRecommended(a: CvList[number], b: CvList[number]) {
  if (a.recommended && !b.recommended) return -1;
  if (!a.recommended && b.recommended) return 1;
  return 0;
}

export default function Index({ rfcs, cv, music, trips }: IndexProps) {
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
                  { image: '/press-photos/press_4_sm.jpg', url: '/press-photos/press_4.jpg', credit: 'Eclipse Foundation (CC-ND 2.0)' },
                  { image: '/press-photos/press_1_sm.jpg', url: '/press-photos/press_1.jpg', credit: 'Erin Sylvester' },
                  { image: '/press-photos/press_2_sm.jpg', url: '/press-photos/press_2.jpg', credit: 'Amelia Bertozzi-Villa' },
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

        <Divider mt={8} mb={8} />

        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8}>
          <Box>
            <Heading as="h2" fontSize="xl" mb={4}>Talks &amp; Interviews</Heading>
            {cv.talksInterviews.sort(sortRecommended).map(e => (
              <CvSummaryEntry
                key={e.title}
                title={e.title}
                url={e.url}
                info={e.venue}
                date={e.date}
                recommended={e.recommended}
                details={!e.recommended}
                fontSize={{ base: 'lg', md: 'md'}}
              />
            ))}
          </Box>
          <Box>
            <Heading as="h2" fontSize="xl" mb={4}>Research Grants</Heading>
            {cv.grants.filter(e => !e.title!.toLowerCase().includes('submitted')).sort(sortRecommended).map(e => (
              <CvSummaryEntry
                key={e.title}
                title={e.title}
                url={e.url}
                info={e.sponsor}
                date={e.date}
                recommended={e.recommended}
                details={!e.recommended}
                fontSize={{ base: 'lg', md: 'md'}}
              />
            ))}

            <Heading as="h2" fontSize="xl" mt={8} mb={4}>Press</Heading>
            {cv.press.sort(sortRecommended).map(e => (
              <CvSummaryEntry
                key={e.title}
                title={e.title}
                url={e.url}
                info={e.outlet}
                date={e.date}
                recommended={e.recommended}
                details={!e.recommended}
                fontSize={{ base: 'lg', md: 'md'}}
              />
            ))}
          </Box>
          <Box>
            <Heading as="h2" fontSize="xl" mb={4}>Publications</Heading>
            {cv.publications.sort(sortRecommended).map(e => (
              <CvSummaryEntry
                key={e.title}
                title={e.title}
                url={e.url}
                info={e.conference}
                date={e.date}
                recommended={e.recommended}
                details={!e.recommended}
                fontSize={{ base: 'lg', md: 'md'}}
              />
            ))}
          </Box>
        </Grid>

        <Divider mt={8} mb={8} />


        <Heading as="h2" fontSize="xl" mb={4}>Personal</Heading>
        <Grid templateColumns={{ base: '1fr', md: '5fr 12fr' }} gap={8}>
          <Box>
            <SmallSubheading mb={2}>Recently Listening:</SmallSubheading>
            <MusicPreview music={music.weeklyAlbum} />

            <SmallSubheading mt={4} mb={2}>Most Listened:</SmallSubheading>
            <MusicPreview music={music.overallAlbum} rows={3} />
          </Box>

          <Box>
            <SmallSubheading mb={2}>Travel:</SmallSubheading>
            <TravelMap
              trips={[
                ...trips,
                { country: 'CA', state: 'British Columbia' },
                { country: 'CA', state: 'Alberta' },
                { country: 'CA', state: 'Ontario' },
                { country: 'CA', state: 'Quebec' },
                { country: 'CA', state: 'Manitoba' },
                { country: 'GB', state: '' },
                { country: 'TT', state: '' },
                { country: 'QA', state: '' },
                { country: 'US', state: 'ID' },
                { country: 'US', state: 'CO' },
                { country: 'US', state: 'WY' },
                { country: 'US', state: 'KS' },
                { country: 'US', state: 'WI' },
                { country: 'US', state: 'AK' },
                { country: 'US', state: 'HI' },
                { country: 'US', state: 'MO' },
                { country: 'US', state: 'MN' },
                { country: 'US', state: 'MD' },
                { country: 'US', state: 'DE' },
                { country: 'US', state: 'WV' },
                { country: 'US', state: 'NJ' },
                { country: 'US', state: 'NH' },
                { country: 'US', state: 'ME' },
                { country: 'US', state: 'CT' },
                { country: 'US', state: 'TN' },
                { country: 'US', state: 'IN' },
                { country: 'US', state: 'NM' },
              ]}
            />
          </Box>
        </Grid>
      </Container>
    </Page>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const [cv, rfcs, music, trips] = await Promise.all([
    await fetch('https://svc.tyler.vc/cv.json').then(r => r.json()),
    await fetch('https://svc.tyler.vc/rfcs.json').then(r => r.json()),
    await fetch('https://svc.tyler.vc/music.json').then(r => r.json()),
    await fetch('https://svc.tyler.vc/trips.json').then(r => r.json()),
  ]);

  return {
    props: {
      rfcs,
      cv,
      music,
      trips,
    },
    revalidate: 300,
  };
}