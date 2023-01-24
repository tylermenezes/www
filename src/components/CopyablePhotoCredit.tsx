import { ChakraProps, Text, useColorModeValue, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { ImCopy, ImCamera } from "react-icons/im";

export interface CopyablePhotoCreditProps extends ChakraProps {
  credit: string | null
}

export function CopyablePhotoCredit({ credit, ...props }: CopyablePhotoCreditProps) {
  const light = useColorModeValue('gray.400', 'whiteAlpha.400');
  const [isHover, setIsHover] = useState(false);
  const toast = useToast();

  const CurrentIcon = isHover ? ImCopy : ImCamera;

  return (
    <Text
      fontSize="sm"
      color={light}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={() => {
        if (credit) {
          navigator.clipboard.writeText(credit);
          toast({ status: 'success', title: 'Photo credit copied to clipboard.' })
        }
      }}
      cursor="pointer"
    >
      {credit && <><CurrentIcon style={{ display: 'inline-block' }} /> {credit}</>}
    </Text>
  );
}