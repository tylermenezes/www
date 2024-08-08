import { Calendly, Page } from '@/components';
import { Container, Heading, Text } from '@chakra-ui/react';
import { GetStaticProps } from 'next';
import and from 'and';
import { DateTime } from 'luxon';
import { Trip } from '@/utils';

interface MeetPageProps {
  trips: Trip[]
}

export default function Meet({ trips }: MeetPageProps) {
  const upcomingTrips = trips.filter(t => t.upcoming || t.active);
  const tripStrings = upcomingTrips
    .map(t => `${t.location} from ${DateTime.fromISO(t.startDate).toLocaleString({ month: 'short', day: 'numeric' })} – ${DateTime.fromISO(t.endDate).toLocaleString(DateTime.DATE_MED)}`);
  return (
    <Page title="Meet">
      <Container maxW="container.md">
        <Heading fontSize="3xl" mt={8} mb={4}>Request a meeting</Heading>
        <Text mb={2}>Please add an agenda unless we already know each other.</Text>
        {upcomingTrips.length > 0 && (
          <Text>
            <strong>If booking in-person meetings: </strong>
            I will be in {and(tripStrings, 'and', true)}.
          </Text>
        )}
        <Calendly slug="tyler-menezes/30min?hide_landing_page_details=1&hide_event_type_details=1" />
      </Container>
    </Page>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const trips = await fetch('https://svc.tyler.vc/trips.json').then(r => r.json());

  return {
    props: {
      trips
    },
    revalidate: 300,
  };
}