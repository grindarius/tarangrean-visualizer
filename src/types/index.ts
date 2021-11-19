import { Dayjs } from 'dayjs'

/**
 * Interface of a subject or a lesson you want to put in to create the table.
 */
export interface Subject {
  id: string
  name: string
  startTime: Dayjs
  endTime: Dayjs
}
