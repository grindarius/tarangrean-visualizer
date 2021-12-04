export const generate2DArray = <T>(width: number, height: number, fill: T): Array<Array<T>> => {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => fill))
}
