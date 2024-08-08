import { config } from "@/config";
import { Trip } from "@/utils";
import { AspectRatio, ChakraProps, useColorModeValue, useToken } from "@chakra-ui/react";
import { Expression, FillPaint } from "mapbox-gl";
import Map, { Source, Layer } from 'react-map-gl';

export interface TravelMapProps extends ChakraProps {
  trips: Pick<Trip, 'country' | 'state'>[]
}

interface CountryConfig {
  name_en: string
  source: string
  iso: string
  layer: string
  property: string
  transformData: (t: Pick<Trip, 'country' | 'state'>) => string,
}

const DETAILED_COUNTRIES: CountryConfig[] = [
  {
    name_en: 'United States',
    iso: 'US',
    source: 'tylermenezes.583mqwge',
    layer: 'geoBoundaries-USA-ADM1_simpli-aht0k9',
    property: 'shapeISO',
    transformData: (t) => `US-${t.state}`,
  },
  {
    name_en: 'China',
    iso: 'CN',
    source: 'tylermenezes.3gl09col',
    layer: 'geoBoundaries-CHN-ADM1_simpli-6m17zl',
    property: 'shapeName',
    transformData: (t) => `${t.state} Province`,
  },
  {
    name_en: 'Canada',
    iso: 'CA',
    source: 'tylermenezes.anlk0yga',
    layer: 'geoBoundaries-CAN-ADM1_simpli-altrvi',
    property: 'shapeName',
    transformData: (t) => t.state,
  }
];
const DETAILED_COUNTRIES_ISO = DETAILED_COUNTRIES.map(c => c.iso);

const WORLDVIEW_FILTER = [
  "all",
  [
    "==",
    ["get", "disputed"],
    "false"
  ],
  [
    "any",
    [
      "==",
      "all",
      ["get", "worldview"]
    ],
    [
      "in",
      "US",
      ["get", "worldview"]
    ]
  ]
];

function mapboxIfData<T, U>(
  property: string,
  defaultValue: T,
  conditions: [U | U[], T][]
): Expression | T {
  const nonNullConditions = conditions
    .filter(([pattern]) => Array.isArray(pattern) ? pattern.length > 0 : pattern);

  if (nonNullConditions.length === 0) return defaultValue;

  return [
    "match",
    ["get", property],
    ...nonNullConditions
      .flatMap(([pattern, val]) => [
        [...new Set(Array.isArray(pattern) ? pattern: [pattern])]
          .filter(Boolean) as U[],
        val
      ]),
    defaultValue,
  ];
}

export function TravelMap({ trips }: TravelMapProps) {
  const mapStyle = useColorModeValue('mapbox://styles/mapbox/light-v11', 'mapbox://styles/mapbox/dark-v11');

  const activeDark = useToken('colors', 'teal.900');
  const activeLight = useToken('colors', 'purple.200');
  const activeFill = useColorModeValue(activeLight, activeDark);

  const inactiveDark = useToken('colors', 'gray.800');
  const inactiveLight = useToken('colors', 'gray.200');
  const inactiveLine = useColorModeValue(inactiveLight, inactiveDark);

  const activeLineDark = useToken('colors', 'purple.800');
  const activeLineLight = useToken('colors', 'teal.300');
  const activeLine = useColorModeValue(activeLineDark, activeLineLight);

  return (
    <AspectRatio ratio={600 / 250}>
      <Map
        mapLib={import('mapbox-gl')}
        initialViewState={{
          latitude: 0,
          longitude: 0,
          zoom: 0,
          bearing: 0,
          pitch: 0,
          padding: { top: 0, bottom: 0, left: 0, right: 0 },
        }}
        projection={{ name: 'equalEarth' }}
        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
        mapStyle={mapStyle}
        mapboxAccessToken={config.mapbox.token}
      >
        
        <Source type="vector" url="mapbox://mapbox.country-boundaries-v1">
          <Layer
            type="fill"
            id="countries"
            source-layer="country_boundaries"
            paint={{
              "fill-color": activeFill,
              "fill-opacity": mapboxIfData('iso_3166_1', 0, [
                [
                  trips
                    .map(t => t.country)
                    .filter(c => !DETAILED_COUNTRIES_ISO.includes(c)),
                  1
                ]
              ]),
            }}
            filter={WORLDVIEW_FILTER}
          />
          <Layer
            type="line"
            id="countries-outline"
            source-layer="country_boundaries"
            paint={{
              "line-color": inactiveLine,
              "line-opacity": mapboxIfData('iso_2166_1', 1, [
                [DETAILED_COUNTRIES_ISO, 0],
              ])
            }}
            filter={WORLDVIEW_FILTER}
          />
          <Layer
            type="line"
            id="countries-outline-active"
            source-layer="country_boundaries"
            paint={{
              "line-color": activeLine,
              "line-opacity": mapboxIfData('iso_3166_1', 0, [
                [
                  trips
                    .map(t => t.country)
                    .filter(c => !DETAILED_COUNTRIES_ISO.includes(c)),
                  1
                ]
              ]),
            }}
            filter={WORLDVIEW_FILTER}
          />
        </Source>
        {DETAILED_COUNTRIES.map(c => (
          <Source type="vector" url={`mapbox://${c.source}`}>
            <Layer
              type="fill"
              id={`country-${c.iso}`}
              source-layer={c.layer}
              paint={{
                "fill-color": activeFill,
                "fill-opacity": mapboxIfData(c.property, 0, [
                  [
                    trips
                      .filter(t => t.country === c.iso || t.country === c.name_en)
                      .map(t => c.transformData(t)),
                    1
                  ]
                ])
              }}
            />
            <Layer
              type="line"
              id={`country-${c.iso}-outline`}
              source-layer={c.layer}
              paint={{
                "line-width": 0.5,
                "line-color": inactiveLine,
              }}
            />
            <Layer
              type="line"
              id={`country-${c.iso}-outline-active`}
              source-layer={c.layer}
              paint={{
                "line-color": activeLine,
                "line-width": 0.5,
                "line-opacity": mapboxIfData(c.property, 0, [
                  [
                    trips
                      .filter(t => t.country === c.iso || t.country === c.name_en)
                      .map(t => c.transformData(t)),
                    1
                  ]
                ])
              }}
            />
          </Source>
        ))}
      </Map>
    </AspectRatio>
  );
}