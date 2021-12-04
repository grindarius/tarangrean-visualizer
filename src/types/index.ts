export interface TimePair {
  startTime: Time
  endTime: Time
}

export interface SubjectSchedule extends TimePair {
  day: DayInWeek
}

export interface UserSelectedTimeSequence extends TimePair {
  lunch: boolean
}

export interface TableOptions extends UserSelectedTimeSequence, SubjectSchedule {
  subjects: Array<Subject>
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

export type TableArray = []

export interface SubjectCell {
  day: DayInWeek
  startTime: Time
  timespan: number
  readonly uid: string
  id: string
  name: string
  color: string
}
