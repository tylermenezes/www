import { Page } from '@/components';
import { Container, Heading, List, ListItem, Text } from '@chakra-ui/react';
import { GetStaticProps } from 'next';
import { DateTime } from 'luxon';
import { Trip } from '@/utils';

interface MeetPageProps {
  trips: Trip[]
}

export default function Meet({ trips }: MeetPageProps) {
  const upcomingTrips = trips.filter(t => t.upcoming || t.active);
  return (
    <Page title="Travel" noIndex>
      <Container maxW="container.md">
        <Heading fontSize="3xl" mt={8} mb={4}>Upcoming Travel</Heading>
        {upcomingTrips.length == 0 ? <Text>No upcoming travel.</Text> : (
          <List styleType="disc" ml={4}>
            {upcomingTrips.reverse().map(t => (
              <ListItem key={t.startDate}>
                <strong>{t.location}: </strong>
                {DateTime.fromISO(t.startDate).toLocaleString({ month: 'long', day: 'numeric' })} &mdash; 
                {DateTime.fromISO(t.endDate).toLocaleString({ month: 'long', day: 'numeric', year: 'numeric' })}
              </ListItem>
            ))}
          </List>
        )}
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