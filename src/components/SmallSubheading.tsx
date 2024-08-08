import { ChakraProps, Heading } from "@chakra-ui/react";
import { ReactNode } from "react";

export interface SmallSubheading extends ChakraProps {
  children: ReactNode
}

export function SmallSubheading({ children, ...props }: SmallSubheading) {
  return (
    <Heading
      as="h3"
      fontSize="sm"
      fontFamily="monospace"
      fontWeight="bold"
      {...props}
    >
      {children}
    </Heading>
  )
}