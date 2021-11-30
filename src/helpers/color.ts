import tinycolor, { Instance } from 'tinycolor2'

import { getRandomInt } from './random'

/**
 * Randomize a `tinycolor2`'s color instance.
 *
 * @returns `tinycolor2` instance of a color.
 */
export const randomColor = (): Instance => {
  const r = getRandomInt(0, 255)
  const g = getRandomInt(0, 255)
  const b = getRandomInt(0, 255)

  const color = tinycolor({ r, g, b })

  return color
}

/**
 * Checks if color is a light color to determine proper font color related to background color using
 * luminance function.
 *
 * @param color `tinycolor2` instance of a color.
 * @returns a boolean telling if the color is light or not.
 */
export const isColorLight = (color: Instance): boolean => {
  const { r, g, b } = color.toRgb()
  const luminance = ((0.299 * r) + (0.587 * g) + (0.114 * b)) / 255

  return luminance > 0.5
}
