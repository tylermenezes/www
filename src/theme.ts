import { extendTheme, withDefaultColorScheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import type { StyleFunctionProps } from '@chakra-ui/styled-system';

export default extendTheme(
  {
    config: {
      initialColorMode: 'system',
      useSystemColorMode: true,
    },
    fonts: {
      heading: `'Abril Fatface', cursive`,
      body: `'Frank Ruhl Libre', serif`,
      monospace: `'Ubuntu Mono', monospace`,
      mono: `'Ubuntu Mono', monospace`,
    },
    colors: {
      black: '#382235',
      white: '#ffffff',
    },
    styles: {
      global: (props: StyleFunctionProps) => ({
        body: {
          color: mode('black', 'whiteAlpha.900')(props),
          bg: mode('white', 'black')(props),
          fontFamily: 'body',
          fontSize: 'lg',
        },
        a: {
          color: props.colorMode === 'light' ? 'teal.500' : 'teal.600',
        }
      }),
    },
    components: {
      Heading: {
        baseStyle: {
          fontWeight: 'normal',
        },
      },
      Link: {
        baseStyle: {
          color: '',
          _hover: {
            textDecoration: 'underline',
          },
        },
      },
    },
  },
  withDefaultColorScheme({ colorScheme: 'purple' }),
  withDefaultColorScheme({ colorScheme: 'teal', components: ['Button'] }),
);
