/* eslint-disable react/no-children-prop */
import { Box, ChakraProps } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import { remarkNotesLink } from '@/remark';
import config from '@/config/clientConfig';

export interface MarkdownProps extends ChakraProps {
  content: string
}

export function Markdown({ content, ...props }: MarkdownProps) {
  return (
    <Box {...props}>
      <ReactMarkdown
        components={ChakraUIRenderer()}
        remarkPlugins={[remarkFrontmatter, remarkGfm, [remarkNotesLink, { prefix: config.obsidian.publicUrl }]]}
        children={content}
      />
    </Box>
  );
}