/**
 * @swagger
 * components:
 *   schemas:
 *     Geo:
 *       type: object
 *       properties:
 *         alt:
 *           type: number
 *         lat:
 *           type: number
 *         lon:
 *           type: number
 *
 *     Airport:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         type:
 *           type: string
 *         airportname:
 *           type: string
 *         city:
 *           type: string
 *         country:
 *           type: string
 *         faa:
 *           type: string
 *         icao:
 *           type: string
 *         tz:
 *           type: string
 *         geo:
 *           $ref: '#/components/schemas/Geo'
 */

type Geo = {
  alt: number
  lat: number
  lon: number
}

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
