import { daysInWeek } from '@/constants'
import { Subject, TableOptions, UserSelectedTimeSequence } from '@/types'
import { createTimeRangeString, generate2DArray } from '.'

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
export const generateTableBody = (subjects: Array<Subject>, sequence: Array<UserSelectedTimeSequence>): Array<Array<TableOptions>> => {
  const options: TableOptions = {
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

  // * added 1 to sequenceLength because of 'Date/Time' section added.
  const table = generate2DArray(sequence.length + 1, 7, options)

  console.log(table.length, table[0].length, sequence.length)

  const mapped = table.map((row, i) => {
    return row.map((_, j) => {
      const resp: TableOptions = {
        day: daysInWeek[i],
        startTime: sequence[j - 1]?.startTime ?? { hour: 0, minute: 0 },
        endTime: sequence[j - 1]?.endTime ?? { hour: 0, minute: 0 },
        lunch: sequence[j - 1]?.lunch ?? false,
        subjects: []
      }

      return resp
    })
  })

  return mapped
}
