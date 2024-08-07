import { ColorModeScript } from '@chakra-ui/react';
import { Html, Head, Main, NextScript } from 'next/document';
import theme from '../theme';

export default function Document() {
    return (
      <Html lang='en'>
        <Head>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Abril+Fatface|Frank+Ruhl+Libre|Ubuntu+Mono&display=swap" />
          <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v3.4.0/mapbox-gl.css' rel='stylesheet' />
        </Head>
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
}
