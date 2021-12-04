import { daysInWeek } from '@/constants'
import { DayInWeek, Subject, SubjectCell, Time } from '@/types'
import { generate2DArray, isSameTime } from '.'

export const generateTableTopRow = (start: Time, stop: Time, skips: Array<Time>): Array<string> => {
  const firstBlock = 'Date/Time'

  const topRowArray = Array.from<Time, Time>({ length: stop.hour - start.hour },
    (_, i) => {
      return {
        hour: start.hour + i,
        minute: 0
      }
    })
    .filter(column => !skips.some(skip => isSameTime(skip, column)))
    .map(column => {
      return `${column.hour.toString().padStart(2, '0')}:${column.minute.toString().padStart(2, '0')} - ${column.hour.toString().padStart(2, '0')}:50`
    })

  return [firstBlock, ...topRowArray]
}

// first have to map subjects into an array of SubjectCell first
// if one subject contains multiple periods, it will be mapped into two separate SubjectCell objects
// then it will be mapped into 2d array for referecing the graph.
export const generateTableBody = (subjects: Array<Subject>, topRow: Array<string>): Record<DayInWeek, Array<DayInWeek>> => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const table = generate2DArray(topRow.length - 1, 7, {} as SubjectCell)
  table.forEach((day, i) => {
    day.unshift(daysInWeek[i])
  })

  const cells = subjects.flatMap(subject => {
    const temp = {
      uid: subject.uid,
      id: subject.id,
      name: subject.name,
      color: subject.color
    }

    return subject.schedule.map(schedule => {
      const partialScheduleCell: SubjectCell = {
        day: schedule.day,
        startTime: schedule.startTime,
        timespan: schedule.endTime.hour - schedule.startTime.hour,
        ...temp
      }

      return partialScheduleCell
    })
  })

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return daysInWeek.reduce<Record<DayInWeek, Array<DayInWeek>>>((k, v) => { return { ...k, [v]: [] } }, {} as Record<DayInWeek, Array<DayInWeek>>)
}
