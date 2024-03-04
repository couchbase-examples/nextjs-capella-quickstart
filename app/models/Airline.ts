
/**
 * @swagger
 * components:
 *   schemas:
 *     Airline:
 *       type: object
 *       properties:
 *         callsign:
 *           type: string
 *         country:
 *           type: string
 *         iata:
 *           type: string
 *         icao:
 *           type: string
 *         id:
 *           type: number
 *         name:
 *           type: string
 *         type:
 *           type: string
 */

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