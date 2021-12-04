<template>
  <div class="modal-background" v-if="newSubjectModalState">
    <div class="modal">
      <!-- content -->
      <div class="modal-content">
        <!-- header -->
        <div class="modal-title">
          <h1>Create new subject</h1>
          <button class="modal-close-button" @click="closeModal">
            <mdicon class="close-modal-icon" name="close-circle-outline" />
          </button>
        </div>
        <!-- body -->
        <div class="modal-body">
          <label for="subject-id" class="subject-id-label">Subject ID</label>
          <input type="text" name="subject-id" class="subject-id-input" placeholder="254459" v-model="subjectId">
          <label for="subject-name" class="subject-name-label">Subject name</label>
          <input type="text" name="subject-name" class="subject-name-input" placeholder="XBox Programming" v-model="subjectName">
          <label for="subject-color" class="subject-color-label">Color</label>
          <div class="color-selector-section">
            <input type="color" name="subject-color" class="subject-color-selector" v-model="subjectColor">
            <input type="text" name="subject-color-input" class="subject-color-input" placeholder="#ffffff" v-model="subjectColor">
            <button class="random-color-button" @click="randomizePastelColor">
              Random
            </button>
          </div>
          <label for="subject-time" class="subject-time-label">Time</label>
          <div class="datetime-controls">
            <div class="datetime-selector-section">
              <day-dropdown v-model:selected-date="selectedDate">Day</day-dropdown>
              <time-dropdown v-model:selected-time="selectedStartTime" :is-start-time="true">Start time</time-dropdown>
              <time-dropdown v-model:selected-time="selectedEndTime" :is-start-time="false">End time</time-dropdown>
              <mdicon class="add-new-subject-schedule" name="plus-circle-outline" @click="addNewSchedule" />
            </div>
            <div v-for="(schedule, i) in subjectSchedules" :key="i" class="selected-datetimes">
              <h1 class="font-sans text-md">
                {{ generateTimeScheduleString(schedule) }}
              </h1>
              <mdicon name="minus-circle-outline" @click="deleteSchedule(i)" />
            </div>
          </div>
        </div>
        <!-- footer -->
        <div class="modal-footer">
          <h1 class="error-message">
            {{ errorMessage }}
          </h1>
          <div>
            <button class="modal-close-button-footer" type="button" @click="closeModal">
              Close
            </button>
            <button class="modal-accept-button" type="button" @click="addNewSubject">
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-background-color" v-if="newSubjectModalState"></div>
</template>

<script lang="ts">
import { nanoid } from 'nanoid'
import { defineComponent, PropType, Ref, ref } from 'vue'

import DayDropdown from '@/components/day-dropdown.vue'
import TimeDropdown from '@/components/time-dropdown.vue'
import { useError, useSubjectColor } from '@/composables'
import { daysInWeek } from '@/constants'
import { createTimeRangeString, isMoreThan } from '@/helpers'
import { DayInWeek, Subject, SubjectSchedule, Time } from '@/types'

export default defineComponent({
  name: 'new-subject-modal',
  components: {
    'day-dropdown': DayDropdown,
    'time-dropdown': TimeDropdown
  },
  props: {
    newSubjectModalState: {
      type: Boolean,
      required: true,
      default: false
    },
    subjects: {
      type: Array as PropType<Array<Subject>>,
      required: true
    }
  },
  emits: [
    'update:newSubjectModalState',
    'update:subjects'
  ],
  setup (props, context) {
    const localSubjects: Ref<Array<Subject>> = ref(props.subjects)

    const subjectId: Ref<string> = ref('')
    const subjectName: Ref<string> = ref('')
    const { color: subjectColor, randomizePastelColor } = useSubjectColor()

    const selectedDate: Ref<DayInWeek | undefined> = ref('Monday')
    const selectedStartTime: Ref<Time | undefined> = ref({
      hour: 8,
      minute: 0
    })
    const selectedEndTime: Ref<Time | undefined> = ref({
      hour: 8,
      minute: 50
    })
    const subjectSchedules: Ref<Array<SubjectSchedule>> = ref([])

    const { errorMessage, createError } = useError()

    const generateTimeScheduleString = (schedule: SubjectSchedule): string => {
      return `${schedule.day}, ${createTimeRangeString(schedule.startTime ?? { hour: 0, minute: 0 }, schedule.endTime ?? { hour: 0, minute: 0 })}`
    }

    const addNewSchedule = (): void => {
      if (selectedDate.value == null) {
        createError('Error: Schedule\'s day is not selected.')
        return
      }

      if (selectedStartTime.value == null) {
        createError('Error: Schedules\'s start time is not selected.')
        return
      }

      if (selectedEndTime.value == null) {
        createError('Error: Schedules\'s end time is not selected.')
        return
      }

      if (isMoreThan(selectedStartTime.value, selectedEndTime.value)) {
        createError('Error: End time is less than start time.')
        return
      }

      subjectSchedules.value.push({
        day: selectedDate.value,
        startTime: selectedStartTime.value,
        endTime: selectedEndTime.value
      })
    }

    const deleteSchedule = (index: number): void => {
      subjectSchedules.value.splice(index, 1)
    }

    const validateInputs = (): string => {
      if (subjectId.value === '') {
        return 'Error: No subject id.'
      }

      if (subjectSchedules.value.length <= 0) {
        return 'Error: No subject schedule defined.'
      }

      if (!/#[0-9a-fA-F]{6}/.test(subjectColor.value)) {
        return 'Error: wrong color format.'
      }

      if (new Set(subjectSchedules.value.map(schedule => {
        return schedule.day + schedule.startTime.hour + schedule.startTime.minute + schedule.endTime.hour + schedule.endTime.minute
      })).size < subjectSchedules.value.length) {
        return 'Error: There\'s a duplicate in schedule date and time.'
      }
      return ''
    }

    const addNewSubject = (): void => {
      if (validateInputs() !== '') {
        createError(validateInputs())
        return
      } else {
        errorMessage.value = ''
      }

      const newSubject: Subject = {
        uid: nanoid(),
        id: subjectId.value,
        name: subjectName.value,
        color: subjectColor.value,
        schedule: subjectSchedules.value
      }

      subjectId.value = ''
      subjectName.value = ''
      subjectSchedules.value = []

      localSubjects.value.push(newSubject)
      context.emit('update:subjects', localSubjects.value)
      closeModal()
    }

    const closeModal = (): void => {
      clearInputs()
      context.emit('update:newSubjectModalState', !props.newSubjectModalState)
    }

    const clearInputs = (): void => {
      subjectId.value = ''
      subjectName.value = ''
      subjectColor.value = '#ffffff'
      subjectSchedules.value = []
    }

    return {
      selectedDate,
      selectedStartTime,
      selectedEndTime,
      daysInWeek,
      subjectSchedules,
      addNewSchedule,
      deleteSchedule,
      subjectId,
      subjectName,
      validateInputs,
      errorMessage,
      addNewSubject,
      subjectColor,
      randomizePastelColor,
      generateTimeScheduleString,
      closeModal
    }
  }
})
</script>

<style scoped lang="scss">
.modal-background {
  @apply overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex;
}

.modal-background-color {
  @apply opacity-25 fixed top-0 inset-0 z-40 bg-black;
}

.modal {
  @apply relative w-full my-6 mx-auto max-w-4xl;
}

.modal-content {
  @apply border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none;
}

.modal-title {
  @apply flex items-start justify-between p-5 border-b border-solid border-gray-200 rounded-t;

  h1 {
    @apply text-3xl font-semibold;
  }
}

.modal-close-button {
  @apply p-1 ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none;
}

.modal-body {
  @apply relative px-5 py-3 grid gap-4;
  grid-template-columns: 0.5fr 1fr;
}

.modal-footer {
  @apply flex items-center justify-between p-6 border-t border-solid border-gray-200 rounded-b;
}

.modal-close-button-footer {
  @apply text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150;
}

.modal-accept-button {
  @apply text-blue-500 bg-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150;
}

.subject-id-label, .subject-name-label, .subject-time-label, .subject-color-label {
  @apply font-sans text-xl font-semibold;
}

.subject-id-input {
  @apply w-full ring-2 ring-blue-500 rounded-md h-9 p-2 focus:ring-blue-700 outline-none;
}

.subject-name-input {
  @apply w-full ring-2 ring-blue-500 rounded-md h-9 p-2 focus:ring-blue-700 outline-none;
}

.datetime-selector-section {
  @apply grid gap-2;
  grid-template-columns: 1fr 1fr 1fr 0.25fr;
}

.selected-datetimes {
  @apply flex flex-row justify-between mt-3;

  span {
    @apply mr-1;
  }
}

.error-message {
  @apply text-red-500 font-sans font-bold text-lg;
}

.color-selector-section {
  @apply grid gap-4 grid-cols-3;
}

.random-color-button {
  @apply outline-none ring-blue-500 bg-blue-500 rounded-lg h-9 text-white font-sans;
}

.subject-color-input {
  @apply w-full ring-2 ring-blue-500 rounded-md h-9 p-2 focus:ring-blue-700 outline-none
}
</style>
