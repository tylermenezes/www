export interface MusicImage {
  size: 'small' | 'medium' | 'large' | 'extralarge' | 'mega'
  '#text': string
}

export interface MusicAlbum {
  artist: {
    mbid: string
    url: string
    name: string
  }
  mbid: string
  url: string
  name: string
  '@attr': {
    rank: string
  }
  image: MusicImage[]
  playcount: string
} 

export interface MusicArtist {
  mbid: string
  url: string
  name: string
  image: MusicImage[]
  '@attr': {
    rank: string
  }
  playcount: string

}

export interface Music {
  overallArtist: MusicArtist[]
  overallAlbum: MusicAlbum[]
  weeklyArtist: MusicArtist[]
  weeklyAlbum: MusicAlbum[]
}