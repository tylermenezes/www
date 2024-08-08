import { Box, ChakraProps, Link, Text, useColorModeValue } from '@chakra-ui/react';
import { DateTime } from 'luxon';

export interface CvSummaryEntryProps extends ChakraProps {
  title?: string | null
  url?: string | null
  date?: string | null
  info?: string | null
  recommended?: boolean | null
  details?: boolean | null
  target?: '_blank' | '_self' | null
}

export function CvSummaryEntry({ title, url, date, info, target, recommended, details, ...props }: CvSummaryEntryProps) {
  const background = useColorModeValue('white', 'black');
  const normal = useColorModeValue('gray.600', 'whiteAlpha.700');
  const lighter = useColorModeValue('gray.400', 'whiteAlpha.400');

  const luxonDate = date && DateTime.fromISO(date) || false;
  const dateStr = (luxonDate && luxonDate.isValid) && luxonDate.toLocaleString(DateTime.DATE_FULL);
  const caption = [info, dateStr].filter(Boolean);
  
  if (!title) return <></>;

  return (
    <Box
      as="a"
      href={url || undefined}
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
        fontSize={!details ? 'md' : 'sm'}
        color={normal}
      >
        {title}
      </Link>
      {caption.length > 0 && (
        <Text fontSize="sm" color={lighter} fontFamily="monospace" mt={-1}>
        {recommended && (
            <Box
              position="relative"
              top="-1px"
              as="span"
              rounded="md"
              p="2px"
              pl="4px"
              pr="4px"
              mr="5px"
              fontSize="2xs"
              backgroundColor={lighter}
              color={background}
              display="inline-block"
              fontFamily="monospace"
            >
              Featured
            </Box>
        )}
          {caption.join(', ')}
        </Text>
      )}
    </Box>
  );
}