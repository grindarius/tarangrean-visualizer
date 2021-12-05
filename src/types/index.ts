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

export interface TableCell extends UserSelectedTimeSequence, SubjectSchedule {
  subjects: Array<SubjectCell>
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

export interface SubjectCell extends Subject {
  duration: number
}

/**
 * Each day in the week
 */
export type DayInWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'

export interface Time {
  hour: number
  minute: number
}
