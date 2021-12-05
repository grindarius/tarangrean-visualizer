import { daysInWeek } from '@/constants'
import { Subject, SubjectCell, TableCell, UserSelectedTimeSequence } from '@/types'
import { createTimeRangeString, generate2DArray, isSameTime } from '.'

export const generateTableTopRow = (sequence: Array<UserSelectedTimeSequence>): Array<string> => {
  const firstBlock = 'Date/Time'

  const timeSequenceString = sequence.map(seq => {
    return createTimeRangeString(seq.startTime, seq.endTime)
  })

  return [firstBlock, ...timeSequenceString]
}

// first have to map subjects into an array of SubjectCell first
// if one subject contains multiple periods, it will be mapped into two separate SubjectCell objects
// then it will be mapped into 2d array for referecing the graph.
export const generateTableBody = (subjects: Array<Subject>, sequence: Array<UserSelectedTimeSequence>): Array<Array<TableCell>> => {
  const options: TableCell = {
    day: 'Monday',
    startTime: {
      hour: 0,
      minute: 0
    },
    endTime: {
      hour: 0,
      minute: 0
    },
    lunch: false,
    subjects: []
  }

  // * added 1 to sequence.length because of 'Date/Time' section taking the first element.
  const tableTemplate = generate2DArray(sequence.length + 1, 7, options)

  const mappedTable = tableTemplate.map((row, i) => {
    return row.map((_, j) => {
      const resp: TableCell = {
        day: daysInWeek[i],
        startTime: sequence[j - 1]?.startTime ?? { hour: 0, minute: 0 },
        endTime: sequence[j - 1]?.endTime ?? { hour: 0, minute: 0 },
        lunch: sequence[j - 1]?.lunch ?? false,
        subjects: []
      }

      return resp
    })
  })

  subjects.forEach(subject => {
    subject.schedule.forEach(schedule => {
      for (const [i, row] of mappedTable.entries()) {
        for (const [j, cell] of row.entries()) {
          if (isSameTime(schedule.startTime, cell.startTime) && schedule.day === cell.day) {
            const hours = schedule.endTime.hour - schedule.startTime.hour
            const subjectCell: SubjectCell = {
              ...subject,
              duration: hours
            }
            mappedTable[i][j].subjects.push(subjectCell)
          }
        }
      }
    })
  })

  return mappedTable
}
