/* @refresh reset */
 
import { useState, useMemo, useEffect, createRef } from 'react';
import { Box, Grid, Image, ChakraProps, SystemProps } from '@chakra-ui/react';
import { CopyablePhotoCredit } from './CopyablePhotoCredit';
import { useWindowSize } from '@/utils';

export interface PressPhotoProps extends ChakraProps {
  photos: { image: string, url: string, credit: string }[]
  templateColumns: SystemProps["gridTemplateColumns"]
}

export function PressPhotoChooser({ photos, templateColumns, ...props }: PressPhotoProps) {
  const [isActive, setIsActive] = useState(false);
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const photoRefs: React.RefObject<HTMLAnchorElement>[] = useMemo(() => Array(photos.length).fill(0).map(_ => createRef()), [photos.length]);
  useWindowSize(); // Force rerender when window size changes

  useEffect(() => {
    if (activePhoto === null || typeof window === 'undefined' || isActive) return () => {}
    const timeout = setTimeout(() => setActivePhoto(null), 6000);
    return () => { clearTimeout(timeout); }
  }, [typeof window, isActive, activePhoto, setActivePhoto]);

  return (
    <Box
      {...props}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      onPointerEnter={() => setIsActive(true)}
      onPointerLeave={() => setIsActive(false)}
    >
      <Grid templateColumns={templateColumns} gap={2} mb={2}>
        {photos.map(({ image, url, credit}, i) => (
          <a
            href={url}
            target="_blank"
            key={image}
            onMouseEnter={() => setActivePhoto(i)}
            onPointerEnter={() => setActivePhoto(i)}
            ref={photoRefs[i]}
            style={{ touchAction: 'none' }}
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