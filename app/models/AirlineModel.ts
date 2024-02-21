// Airline document model
type Airline = {
  callsign?: string
  country: string
  iata?: string
  icao: string
  id: number
  name: string
  type: string
}

export type { Airline }