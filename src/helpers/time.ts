import { DayInWeek, Time } from '@/types'

/**
 * A function to generate time sequence string specified to NU schedule.
 * Start range is exclusive but end range is inclusive. [start, end)
 *
 * @param start start time sequence.
 * @param end end time sequence.
 * @param skips place to skip.
 * @returns an array of numbers of each day.
 */
export const generateTimeSequence = (start: Time, end: Time, skips: Array<Time>): Array<Time> => {
  const arrayLength = end.hour - start.hour
  const mappedSkips = skips.length === 0 ? [] : skips.map(skip => skip.hour)

  return Array.from<Time, Time>({ length: arrayLength }, (_, i) => {
    return { hour: start.hour + i, minute: 0 }
  }).filter(i => !mappedSkips.includes(i.hour))
}

export const createTimeSequenceString = (time: Time): string => {
  return `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`
}

export const createTimeRangeString = (start: Time, end: Time): string => {
  return `${createTimeSequenceString(start)} - ${createTimeSequenceString(end)}`
}

export const createTimeScheduleString = (day: DayInWeek, startTime: Time, endTime: Time): string => {
  return `${day}, ${createTimeRangeString(startTime, endTime)}`
}

export const isSameTime = (t1: Time, t2: Time): boolean => {
  return t1.hour === t2.hour && t1.minute === t2.minute
}

export const isMoreThan = (t1: Time, t2: Time): boolean => {
  if (t1.hour === t2.hour) {
    return t1.minute > t2.minute
  } else {
    return t1.hour > t2.hour
  }
}
