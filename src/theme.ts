import { extendTheme, withDefaultColorScheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import type { StyleFunctionProps } from '@chakra-ui/styled-system';

export const fonts = {
  heading: `'Abril Fatface', cursive`,
  body: `'Frank Ruhl Libre', serif`,
  monospace: `'Ubuntu Mono', monospace`,
  mono: `'Ubuntu Mono', monospace`,
};

export const colors = {
  black: '#382235',
  white: '#ffffff',
};

export const styles = {
  global: (props: StyleFunctionProps) => ({
    body: {
      color: mode('black', 'whiteAlpha.900')(props),
      bg: mode('white', 'black')(props),
      fontFamily: 'body',
      fontSize: 'lg',
    },
  }),
};

export const components = {
  Heading: {
    baseStyle: {
      fontWeight: 'normal',
    },
  },
  Link: {
    baseStyle: {
      color: 'teal.500',
      _hover: {
        textDecoration: 'underline',
      },
    },
  },
}

export default extendTheme(
  {
    fonts,
    colors,
    styles,
    components,
  },
  withDefaultColorScheme({ colorScheme: 'purple' }),
  withDefaultColorScheme({ colorScheme: 'teal', components: ['Button'] }),
);
