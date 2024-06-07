import { GetStaticProps, GetStaticPaths } from 'next';
import { DateTime } from 'luxon';
import { Box, Container, Heading, Image, Link, Text, useColorModeValue } from '@chakra-ui/react';
import clientConfig from '@/config/clientConfig';
import { Page, Markdown } from '@/components';
import { Rfc } from '@/utils';

const CHECK_TAG = `#${clientConfig.obsidian.blogTag}`;

interface BlogPostProps {
  title: string
  tags: string[]
  image?: string
  slug: string
  publish: boolean
  unlisted: boolean
  createdAt: string
  updatedAt: string
  data: string
}

export default function BlogPost({
  title,
  tags,
  image,
  slug,
  data,
  createdAt: _createdAt,
  updatedAt: _updatedAt
}: BlogPostProps) {
  const light = useColorModeValue('gray.600', 'whiteAlpha.500');
  const bg = useColorModeValue('white', 'black');
  const createdAt = _createdAt && DateTime.fromISO(_createdAt);
  const updatedAt = _updatedAt && DateTime.fromISO(_updatedAt);

  return (
    <Page title={title}>
      <Container maxW="container.md">
        <Box mt={image ? 2 : 8} mb={8}>
          {image && (
            <Image src={image} w="100%" alt="" mb={{ base: -6, md: -8, lg: -12 }} />
          )}
          <Box ml={image ? 4 : 0}>
            <Heading
              as="h1"
              mb={2}
              fontSize={{ base: '4xl', md: '5xl', xl: '6xl' }}
              backgroundColor={bg}
              display="inline"
              pl={image ? 2 : 0}
              pr={image ? 2 : 0}
              position="relative"
              zIndex={500}
              boxDecorationBreak="clone"
              lineHeight={1.3}
            >
              {title}
            </Heading>
            {createdAt && (
              <Text color={light} fontFamily="monospace" fontWeight="bold" fontSize="sm" pl={image ? 2 : 0}>
                Published {createdAt.toLocaleString(DateTime.DATE_FULL)}{
                  updatedAt ? `; last updated ${updatedAt.toLocaleString(DateTime.DATE_FULL)}` : ''
                }.
              </Text>
            )}
            {tags && tags.length > 0 && (
              <Text color={light} fontFamily="monospace" fontWeight="bold" fontSize="sm" pl={image ? 2 : 0}>
                Tags: {tags.map(t => <Link key={t} mr={2} href={`/tag/${t}`}>#{t}</Link>)}
              </Text>
            )}
          </Box>
        </Box>

        <Markdown content={data} />
      </Container>
    </Page>
  );
}

export const getStaticProps: GetStaticProps<BlogPostProps> = async ({ params }) => {
  const rfcs = await fetch('https://svc.tyler.vc/rfcs.json').then(r => r.json()) as Rfc[];
  const { data, ...post } = rfcs.find((r: any) => r.slug === params!.blog)!;

  const cleanedContent = data
      .split(`\n`)
      .filter((line: string) => !(line.startsWith('# ') || line.startsWith('Tags: ')))
      .join(`\n`);

  return {
    props: {
      data: cleanedContent,
      ...post,
    },
    revalidate: 300,
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const rfcs = await fetch('https://svc.tyler.vc/rfcs.json').then(r => r.json());

  return {
    paths: rfcs.map(({ slug }: { slug: string }) => ({ params: { blog: slug } })),
    fallback: 'blocking',
  };
}