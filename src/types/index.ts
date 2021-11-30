export interface SubjectSchedule {
  day: DayInWeek
  startTime: Time
  endTime: Time
}

/**
 * Interface of a subject or a lesson you want to put in to create the table.
 */
export interface Subject {
  readonly uid: string
  id: string
  name: string
  color: string
  schedule: Array<SubjectSchedule>
}

/**
 * Each day in the week
 */
export type DayInWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'

export interface Time {
  hour: number
  minute: number
}

export interface Pair<T, U> {
  key: T
  value: U
}

export type TableArray = []
