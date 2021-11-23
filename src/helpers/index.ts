import tinycolor, { Instance } from 'tinycolor2'

/**
 * A function to random a number exclusively on both ends, unified output. [min, max].
 *
 * @param min minimum exclusive value
 * @param max maximum inclusive value
 * @returns random int in between.
 */
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min)) + min
}

export const generateTimeSequence = (start: number, end: number, skips: number[]): number[] => {
  const arrayLength = end - start
  return Array.from<number, number>({ length: arrayLength }, (_, i) => i + start).filter(i => !skips.includes(i))
}

export const randomColor = (): Instance => {
  const r = getRandomInt(0, 255)
  const g = getRandomInt(0, 255)
  const b = getRandomInt(0, 255)

  const color = tinycolor({ r, g, b })

  return color
}

export const isColorLight = (color: Instance): boolean => {
  const { r, g, b } = color.toRgb()
  const luminance = ((0.299 * r) + (0.587 * g) + (0.114 * b)) / 255

  return luminance > 0.5
}
