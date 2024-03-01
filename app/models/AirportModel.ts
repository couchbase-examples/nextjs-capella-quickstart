// Geo document model
type Geo = {
  alt: number
  lat: number
  lon: number
}

// Airport document model
type Airport = {
  id: number
  type: string
  airportname?: string
  city: string
  country: string
  faa: string
  icao?: string
  tz?: string
  geo?: Geo
}

export type { Airport }
