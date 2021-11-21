// bool isColorLight(Color c) {
//   int red = c.red;
//   int green = c.green;
//   int blue = c.blue;

//   double brightness = ((red * 299) + (green * 587) + (blue * 114)) / 1000;
//   return brightness > 125;
// }

// export const isColorLight = (input: string): boolean => {

// }
export const generateTimeSequence = (start: number, end: number, skips: number[]): number[] => {
  const arrayLength = end - start
  return Array.from<number, number>({ length: arrayLength }, (_, i) => i + start).filter(i => !skips.includes(i))
}
