
type Schedule = {
  day: number
  flight: string
  utc: string
}

type Route = {
  id: number
  type: string
  airline?: string
  airlineid?: string
  sourceairport?: string
  destinationairport?: string
  stops?: number
  equipment?: string
  schedule?: Schedule[]
  distance?: number
}

export type { Route }