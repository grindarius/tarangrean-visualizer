import tinycolor, { Instance } from 'tinycolor2'

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min)) + min
}

export const generateTimeSequence = (start: number, end: number, skips: number[]): number[] => {
  const arrayLength = end - start
  return Array.from<number, number>({ length: arrayLength }, (_, i) => i + start).filter(i => !skips.includes(i))
}

export const randomHSVColor = (): Instance => {
  const h = getRandomInt(0, 360)
  const s = getRandomInt(0, 100)
  const v = getRandomInt(0, 100)

  const color = tinycolor({ h, s, v })

  return color
}

export const isColorLight = (color: Instance): boolean => {
  const brightness = color.getBrightness()

  return brightness > 125
}
