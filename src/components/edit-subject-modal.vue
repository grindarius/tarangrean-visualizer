<template>
  <div class="modal-background cursor-pointer" v-if="editSubjectModalState">
    <div class="modal">
      <!-- content -->
      <div class="modal-content">
        <!-- header -->
        <div class="modal-title">
          <h1>{{ headerMessage }}</h1>
          <button class="modal-close-button-icon" @click="$emit('update:editSubjectModalState', !editSubjectModalState)">
            <mdicon class="close-modal-icon" name="close-circle-outline" />
          </button>
        </div>
        <!-- body -->
        <div class="modal-body">
          <label for="subject-id" class="subject-id-label">Subject ID</label>
          <input type="text" name="subject-id" class="subject-id-input" placeholder="254459" v-model="localSubject.id">
          <label for="subject-name" class="subject-name-label">Subject name</label>
          <input type="text" name="subject-name" class="subject-name-input" placeholder="XBox Programming" v-model="localSubject.name">
          <label for="subject-color" class="subject-color-label">Color</label>
          <div class="color-selector-section">
            <input type="color" name="subject-color" class="subject-color-selector" v-model="localSubject.color">
            <input type="text" name="subject-color-input" class="subject-color-input" placeholder="#ffffff" v-model="localSubject.color">
            <button class="random-color-button" @click="randomizePastelColor">
              Random
            </button>
          </div>
          <label for="subject-time" class="subject-time-label">Time</label>
          <div class="datetime-controls">
            <div class="datetime-selector-section">
              <day-dropdown v-model:selectedDate="selectedDate"></day-dropdown>
              <time-dropdown v-model:selectedTime="selectedStartTime" :timeArray="startTimeDropdown"></time-dropdown>
              <time-dropdown v-model:selectedTime="selectedEndTime" :timeArray="endTimeDropdown"></time-dropdown>
              <mdicon class="add-new-subject-schedule" name="plus-circle-outline" @click="addNewSchedule" />
            </div>
            <div v-for="(schedule, i) in localSubject.schedule" :key="i" class="selected-datetimes">
              <h1 class="font-sans text-md">
                {{ timeScheduleString(schedule) }}
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
            <button class="modal-close-button" type="button" @click="$emit('update:editSubjectModalState', !editSubjectModalState)">
              Close
            </button>
            <button class="modal-close-button" type="button" @click="removeSubject">
              Remove
            </button>
            <button class="modal-accept-button" type="button" @click="submitSubject">
              Submit changes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-background-color" v-if="editSubjectModalState"></div>
</template>

<script lang="ts">
import cloneDeep from 'lodash/cloneDeep'
import tinycolor, { Instance } from 'tinycolor2'
import { computed, ComputedRef, defineComponent, PropType, Ref, ref, watch } from 'vue'

import DayDropdown from '@/components/day-dropdown.vue'
import TimeDropdown from '@/components/time-dropdown.vue'
import { useError } from '@/composables'
import { createTimeScheduleString, generateTimeSequence, randomColor } from '@/helpers'
import { DayInWeek, Subject, SubjectSchedule, Time } from '@/types'

export default defineComponent({
  name: 'edit-subject-modal',
  components: {
    'day-dropdown': DayDropdown,
    'time-dropdown': TimeDropdown
  },
  props: {
    editSubjectModalState: {
      type: Boolean,
      required: true,
      default: false
    },
    subject: {
      type: Object as PropType<Subject>,
      required: true
    }
  },
  emits: [
    'update:editSubjectModalState',
    'update:subject',
    'removeSubject'
  ],
  setup (props, context) {
    const localSubject = ref(cloneDeep(props.subject))

    const headerMessage = computed(() => {
      return localSubject.value.id || 'Edit Subject'
    })

    const selectedDate: Ref<DayInWeek> = ref('Monday')
    const selectedStartTime: Ref<Time> = ref({
      hour: 8,
      minute: 0
    })
    const selectedEndTime: Ref<Time> = ref({
      hour: 8,
      minute: 50
    })

    const { errorMessage, createError } = useError()

    const startTimeDropdown: Ref<Array<Time>> = ref(generateTimeSequence(
      { hour: 8, minute: 0 },
      { hour: 20, minute: 0 },
      [{ hour: 12, minute: 0 }]
    ))
    const endTimeDropdown: ComputedRef<Array<Time>> = computed(() => {
      const mappedTimeDropdown = startTimeDropdown.value.map(time => {
        return {
          hour: time.hour,
          minute: 50
        }
      })

      return selectedStartTime.value == null
        ? mappedTimeDropdown
        : mappedTimeDropdown.filter(time => selectedStartTime.value != null && time.hour >= selectedStartTime.value.hour)
    })

    const timeScheduleString = (schedule: SubjectSchedule): string => {
      return createTimeScheduleString(schedule.day, schedule.startTime, schedule.endTime)
    }

    const addNewSchedule = (): void => {
      localSubject.value.schedule.push({
        day: selectedDate.value,
        startTime: selectedStartTime.value,
        endTime: selectedEndTime.value
      })
    }

    const deleteSchedule = (index: number): void => {
      localSubject.value.schedule.splice(index, 1)
    }

    const validateInputs = (): string => {
      if (localSubject.value.id === '') {
        return 'Error: No subject id.'
      }

      if (localSubject.value.schedule.length <= 0) {
        return 'Error: No subject schedule defined.'
      }

      if (!/#[0-9a-fA-F]{6}/.test(localSubject.value.color)) {
        return 'Error: wrong color format.'
      }

      if (new Set(localSubject.value.schedule.map(schedule => {
        return schedule.day + schedule.startTime.hour + schedule.startTime.minute + schedule.endTime.hour + schedule.endTime.minute
      })).size < localSubject.value.schedule.length) {
        return 'Error: There\'s a duplicate in schedule date and time.'
      }
      return ''
    }

    const removeSubject = (): void => {
      context.emit('update:editSubjectModalState', !props.editSubjectModalState)
      context.emit('removeSubject', localSubject.value.uid)
    }

    const submitSubject = (): void => {
      if (validateInputs() !== '') {
        createError(validateInputs())
        return
      } else {
        errorMessage.value = ''
      }

      context.emit('update:subject', localSubject.value)
      context.emit('update:editSubjectModalState', !props.editSubjectModalState)
    }

    const randomizePastelColor = (): void => {
      const randomedColor: Instance = randomColor()
      const saturatedColor: Instance = randomedColor.saturate(10)
      const mixedWithWhite: Instance = tinycolor.mix(saturatedColor, { r: 255, g: 255, b: 255 })

      localSubject.value.color = mixedWithWhite.toHexString()
    }

    watch(() => props.subject, (value) => {
      localSubject.value = value
    }, { deep: true })

    return {
      startTimeDropdown,
      endTimeDropdown,
      selectedDate,
      selectedStartTime,
      selectedEndTime,
      addNewSchedule,
      deleteSchedule,
      localSubject,
      validateInputs,
      errorMessage,
      submitSubject,
      headerMessage,
      removeSubject,
      timeScheduleString,
      randomizePastelColor
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

.modal-close-button-icon {
  @apply p-1 ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none;
}

.modal-body {
  @apply relative px-5 py-3 grid gap-4;
  grid-template-columns: 0.5fr 1fr;
}

.modal-footer {
  @apply flex items-center justify-between p-6 border-t border-solid border-gray-200 rounded-b;
}

.modal-close-button, .modal-remove-button {
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

.day-dropdown, .start-time-dropdown, .end-time-dropdown {
  @apply w-full outline-none border-2 border-blue-500 rounded-md h-9 focus:border-blue-700 cursor-pointer;
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

.subject-color-input {
  @apply w-full ring-2 ring-blue-500 rounded-md h-9 p-2 focus:ring-blue-700 outline-none
}

.random-color-button {
  @apply outline-none ring-blue-500 bg-blue-500 rounded-lg h-9 text-white font-sans;
}

.color-selector-section {
  @apply grid gap-4 grid-cols-3;
}
</style>
