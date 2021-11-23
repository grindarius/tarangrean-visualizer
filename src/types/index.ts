export interface SubjectSchedule {
  day: DayInWeek
  startTime: TimeRange
  endTime: TimeRange
}

/**
 * Interface of a subject or a lesson you want to put in to create the table.
 */
export interface Subject {
  readonly uid: string
  id: string
  name: string
  color?: string
  schedule: SubjectSchedule[]
}

/**
 * Each day in the week
 */
export type DayInWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'

export type TimeRange = '8' | '9' | '10' | '11' | '13' | '14' | '15' | '16' | '17' | '18' | '19'

export interface Pair<T, R> {
  key: T
  value: R
}
