/**
 * A function to random a number exclusively on both ends, unified output. [min, max].
 *
 * @param min minimum exclusive value
 * @param max maximum inclusive value
 * @returns random int in between.
 */
export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min)) + min
}
