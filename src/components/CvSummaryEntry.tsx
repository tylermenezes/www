import { Box, ChakraProps, Link, Text, useColorModeValue } from '@chakra-ui/react';
import { DateTime } from 'luxon';

export interface CvSummaryEntryProps extends ChakraProps {
  title?: string | null
  url?: string | null
  date?: string | null
  info?: string | null
  recommended?: boolean | null
  target?: '_blank' | '_self' | null
}

export function CvSummaryEntry({ title, url, date, info, target, recommended, ...props }: CvSummaryEntryProps) {
  const light = useColorModeValue('gray.400', 'whiteAlpha.400');

  const luxonDate = date && DateTime.fromISO(date) || false;
  const dateStr = (luxonDate && luxonDate.isValid) && luxonDate.toLocaleString(DateTime.DATE_FULL);
  const caption = [info, dateStr].filter(Boolean);
  
  if (!title) return <></>;

  return (
    <Box
      as="a"
      href={url || undefined}
      fontSize="md"
      target={target || '_blank'}
      rel="noreferrer"
      mb={3}
      display="block"
      {...props}
    >
      <Link
        as="div"
        lineHeight={1.3}
        display="inline-block"
      >
        {recommended ? '✦ ' : ''}
        {title}
      </Link>
      {caption.length > 0 && (
        <Text fontSize="sm" color={light} fontFamily="monospace" mt={-1}>
          {caption.join(', ')}
        </Text>
      )}
    </Box>
  );
}