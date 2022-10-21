import { Container, Box, Heading, Text, Link, Button, useColorModeValue, Flex } from '@chakra-ui/react';
import { ReactNode } from 'react';
import Head from 'next/head';
import { DateTime } from 'luxon';

export interface PageProps {
  title?: string
  credits?: string
  children: ReactNode
}

export function Page({ title, credits, children }: PageProps) {
  const bg = useColorModeValue('white', 'black');
  const fg = useColorModeValue('black', 'white');
  const light = useColorModeValue('gray.400', 'gray.600');

  return (
    <>
      <Head>
        <title>{title ? `${title} / Tyler Menezes` : 'Tyler Menezes'}</title>
      </Head>
      <Box position="sticky" w="100%" top={0} zIndex={1000} mt={1} bg={bg}>
        <Container maxW="container.md">
          <Flex justifyContent="space-between" borderBottomWidth={2} borderBottomColor={fg} pb={1}>
            <Heading
              as="a"
              href="/"
              color={fg}
              fontSize="xl"
              fontFamily="mono"
              fontWeight="bold"
              pt={2}
            >
              Tyler Menezes
            </Heading>
            <Box alignSelf="flex-end">
              <Button
                as="a"
                variant="ghost"
                href="https://flickr.com/tylermenezes"
                target="_blank"
                fontFamily="monospace"
              >
                Photos
              </Button>
              <Button
                as="a"
                variant="ghost"
                href="https://notes.tyler.vc/"
                target="_blank"
                fontFamily="monospace"
              >
                Notes
              </Button>
              <Button
                as="a"
                size="md"
                variant="ghost"
                href="/meet"
                fontFamily="monospace"
              >
                Meet
              </Button>
            </Box>
          </Flex>
        </Container>
      </Box>
      <Box>
        {children}
      </Box>
      <Container maxW="container.md" mt={8} mb={8} color={light} fontSize="sm" fontFamily="monospace">
        &copy; 2006&mdash;{DateTime.now().year} Tyler Menezes. {credits}
      </Container>
    </>
  )
}