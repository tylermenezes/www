import { useState, useMemo, useEffect, createRef } from 'react';
import { Box, Grid, Image, ChakraProps } from '@chakra-ui/react';
import { CopyablePhotoCredit } from './CopyablePhotoCredit';

export interface PressPhotoProps extends ChakraProps {
  photos: { image: string, url: string, credit: string }[]
  gridLength: number
}

export function PressPhotoChooser({ photos, gridLength, ...props }: PressPhotoProps) {
  const [isActive, setIsActive] = useState(false);
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const photoRefs: React.RefObject<HTMLAnchorElement>[] = useMemo(() => Array(photos.length).fill(0).map(_ => createRef()), [photos.length]);

  useEffect(() => {
    if (activePhoto === null || typeof window === 'undefined' || isActive) return () => {}
    const timeout = setTimeout(() => setActivePhoto(null), 6000);
    return () => { clearTimeout(timeout); }
  }, [typeof window, isActive, activePhoto, setActivePhoto]);

  return (
    <Box {...props} onMouseEnter={() => setIsActive(true)} onMouseLeave={() => setIsActive(false)}>
      <Grid templateColumns={`repeat(${gridLength}, 1fr)`} gap={2} mb={2}>
        {photos.map(({ image, url, credit}, i) => (
          <a
            href={url}
            target="_blank"
            key={image}
            onMouseEnter={() => setActivePhoto(i)}
            ref={photoRefs[i]}
          >
            <Image src={image} alt={credit} />
          </a>
        ))}
      </Grid>
      <Box position="absolute" left={`${photoRefs[activePhoto || 0]?.current?.offsetLeft || 0}px`}>
        <CopyablePhotoCredit credit={activePhoto !== null ? photos[activePhoto].credit : null} />
      </Box>
    </Box>
  );
}