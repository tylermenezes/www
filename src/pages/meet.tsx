import { Calendly, Page } from '@/components';
import { Container, Heading, Text } from '@chakra-ui/react';

export default function Meet() {
  return (
    <Page title="Meet">
      <Container maxW="container.md">
        <Heading fontSize="3xl" mt={8} mb={4}>Request a meeting</Heading>
        <Text>If we don't already know each other, you must add an agenda or I'll cancel the meeting.</Text>
        <Calendly slug="tyler-menezes/30min?hide_landing_page_details=1&hide_event_type_details=1" />
      </Container>
    </Page>
  )
}