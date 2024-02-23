/* eslint-disable react/no-children-prop */
import { Box, ChakraProps, Checkbox, ListItem } from '@chakra-ui/react';
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
        components={ChakraUIRenderer({
          blockquote: props => {
            return (
              <Box mt={6} mb={6} ml={4} pl={4} borderLeftWidth={2} fontStyle="italic">
                {props.children}
              </Box>
            )
          },
          li: props => {
            const { children, checked } = props;
            let checkbox = null;
            if (checked !== null && checked !== undefined) {
              checkbox = (
                <Checkbox isChecked={checked} isReadOnly>
                  {children}
                </Checkbox>
              );
            }
            return (
              <ListItem
                {...props}
                listStyleType={checked !== null ? 'none' : 'inherit'}
              >
                {checkbox || children}
              </ListItem>
            );
          },
        })}
        remarkPlugins={[remarkFrontmatter, remarkGfm, [remarkNotesLink, { prefix: config.obsidian.publicUrl }]]}
        children={content}
      />
    </Box>
  );
}