/**
 * Returns a uniformaly random integer from the interval [0, max).
 */
export function randomInt(max: number): number {
  return Math.floor(Math.random() * Math.ceil(max))
}