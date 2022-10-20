import { Box, ChakraProps } from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';

export interface CalendlyProps extends ChakraProps {
  slug: string
}

export function Calendly ({ slug, ...props }: CalendlyProps) {
  const holder = useRef(null);
  const [hasCalendlyLoaded, setHasCalendlyLoaded] = useState(false);
  const [hasCalendar, setHasCalendar] = useState(false);

  const windowCalendly = typeof window !== 'undefined' && (window as any).Calendly;

  useEffect(() => {
    if (window && !(window as any).Calendly) {
      const script = document.createElement('script');
      script.src = 'https://calendly.com/assets/external/widget.js';
      script.addEventListener('load', () => {
        setHasCalendlyLoaded(true);
      });
      document.head.appendChild(script);

      const link = document.createElement('link');
      link.href = 'https://calendly.com/assets/external/widget.css';
      link.rel = 'stylesheet';
      document.body.appendChild(link);

      return () => {
        document.head.removeChild(script);
        document.body.removeChild(link);
      }
    }
  }, [typeof window]);

  useEffect(() => {
    if (windowCalendly && holder?.current && !hasCalendar) {
      (window as any).Calendly.initInlineWidget({
        url: `https://calendly.com/${slug}`,
        parentElement: holder.current,
        prefill: {},
        utm: {}
      });
      setHasCalendar(true);
    }
  }, [windowCalendly, hasCalendlyLoaded, hasCalendar, holder, slug]);

  return (
    <Box w="100%" h="container.md" {...props} ref={holder} />
  );
}