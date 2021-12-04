import { DayInWeek, UserSelectedTimeSequence } from '@/types'

type DayInWeekTuple = [DayInWeek, DayInWeek, DayInWeek, DayInWeek, DayInWeek, DayInWeek, DayInWeek]

export const daysInWeek: DayInWeekTuple = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const userSelectedTimeSequence: Array<UserSelectedTimeSequence> = [
  {
    startTime: {
      hour: 8,
      minute: 0
    },
    endTime: {
      hour: 8,
      minute: 50
    },
    lunch: false
  },
  {
    startTime: {
      hour: 9,
      minute: 0
    },
    endTime: {
      hour: 9,
      minute: 50
    },
    lunch: false
  },
  {
    startTime: {
      hour: 10,
      minute: 0
    },
    endTime: {
      hour: 10,
      minute: 50
    },
    lunch: false
  },
  {
    startTime: {
      hour: 11,
      minute: 0
    },
    endTime: {
      hour: 11,
      minute: 50
    },
    lunch: false
  },
  {
    startTime: {
      hour: 12,
      minute: 0
    },
    endTime: {
      hour: 12,
      minute: 50
    },
    lunch: true
  },
  {
    startTime: {
      hour: 13,
      minute: 0
    },
    endTime: {
      hour: 13,
      minute: 50
    },
    lunch: false
  },
  {
    startTime: {
      hour: 14,
      minute: 0
    },
    endTime: {
      hour: 14,
      minute: 50
    },
    lunch: false
  },
  {
    startTime: {
      hour: 15,
      minute: 0
    },
    endTime: {
      hour: 15,
      minute: 50
    },
    lunch: false
  },
  {
    startTime: {
      hour: 16,
      minute: 0
    },
    endTime: {
      hour: 16,
      minute: 50
    },
    lunch: false
  },
  {
    startTime: {
      hour: 17,
      minute: 0
    },
    endTime: {
      hour: 17,
      minute: 50
    },
    lunch: false
  }
]
