import { MusicAlbum, MusicArtist, MusicImage } from "@/utils";
import { ChakraProps, Grid, Image, Link } from "@chakra-ui/react";

export interface MusicPreviewProps extends ChakraProps {
  rows?: number
  music: (MusicArtist | MusicAlbum)[]
}

function sortMusicImage(a: MusicImage, b: MusicImage) {
  const sizes = {
    'large': 0,
    'medium': 1,
    'extralarge': 2,
    'small': 3,
    'mega': 4,
  };

  if (a.size in sizes && !(b.size in sizes)) return -1;
  if (!(a.size in sizes) && b.size in sizes) return 1;
  return sizes[a.size] > sizes[b.size] ? 1 : -1;
}

export function MusicPreview({ music, rows, ...props }: MusicPreviewProps) {
  return (
    <Grid templateColumns="repeat(6, 1fr)" gap={1} {...props}>
      {music.filter(a => a.image?.length > 0).slice(0, 6 * (rows || 1)).map(a => (
        <Link key={a.url} href={a.url} target="_blank">
          <Image
            w="100%"
            src={a.image.sort(sortMusicImage)[0]['#text']}
          />
        </Link>
      ))}
    </Grid>
  )
}