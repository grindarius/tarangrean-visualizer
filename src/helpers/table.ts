import { daysInWeek } from '@/constants'
import { DayInWeek, Subject, Time } from '@/types'

export const generateTableTopRow = (start: Time, stop: Time, skips: Array<Time>): Array<string> => {
  const firstBlock = 'Date/Time'
  const skipsNumber = skips.length !== 0
    ? skips.map(skip => skip.hour)
    : []

  const topRowArray = Array.from<number, number>({ length: stop.hour - start.hour },
    (_, i) => start.hour + i)
    .filter(column => !skipsNumber.includes(column))
    .map(column => {
      const columnString = column.toString()
      return `${columnString.padStart(2, '0')}:00 - ${columnString.padStart(2, '0')}:50`
    })

  return [firstBlock, ...topRowArray]
}

export const generateTableBody = (subjects: Array<Subject>): Record<DayInWeek, Array<DayInWeek>> => {
  const subjectsToDisplay = daysInWeek.reduce<Record<DayInWeek, Array<DayInWeek>>>((k, v) => {
    return {
      ...k,
      [v]: []
    }
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  }, {} as Record<DayInWeek, Array<DayInWeek>>)

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return daysInWeek.reduce<Record<DayInWeek, Array<DayInWeek>>>((k, v) => { return { ...k, [v]: [] } }, {} as Record<DayInWeek, Array<DayInWeek>>)
}
