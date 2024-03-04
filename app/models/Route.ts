/**
 * @swagger
 * components:
 *   schemas:
 *     Schedule:
 *       type: object
 *       properties:
 *         day:
 *           type: number
 *         flight:
 *           type: string
 *         utc:
 *           type: string
 *
 *     Route:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         type:
 *           type: string
 *         airline?:
 *           type: string
 *         airlineid?:
 *           type: string
 *         sourceairport?:
 *           type: string
 *         destinationairport?:
 *           type: string
 *         stops?:
 *           type: number
 *         equipment?:
 *           type: string
 *         schedule?:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Schedule'
 *         distance?:
 *           type: number
 */

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