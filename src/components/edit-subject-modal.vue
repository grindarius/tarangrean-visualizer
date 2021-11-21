<template>
  <div class="modal-background cursor-pointer" v-if="editSubjectModalState">
    <div class="modal">
      <!-- content -->
      <div class="modal-content">
        <!-- header -->
        <div class="modal-title">
          <h1>{{ headerMessage }}</h1>
          <button class="modal-close-button" @click="$emit('update:editSubjectModalState', !editSubjectModalState)">
            <mdicon class="close-modal-icon" name="close-circle-outline" />
          </button>
        </div>
        <!-- body -->
        <div class="modal-body">
          <label for="subject-id" class="subject-id-label">Subject ID</label>
          <input type="text" name="subject-id" class="subject-id-input" placeholder="254459" v-model="localSubject.id">
          <label for="subject-name" class="subject-name-label">Subject name</label>
          <input type="text" name="subject-name" class="subject-name-input" placeholder="XBox Programming" v-model="localSubject.name">
          <label for="subject-time" class="subject-time-label">Time</label>
          <div class="datetime-controls">
            <div class="datetime-selector-section">
              <select name="day-dropdown" class="day-dropdown" v-model="selectedDate">
                <option v-for="(day, i) in daysInWeek" :key="i" :value="day">{{ day }}</option>
              </select>
              <select name="start-time-dropdown" class="start-time-dropdown" v-model="selectedStartTime">
                <option v-for="(time, i) in startTimeDropdown" :key="i" :value="time.key">{{ time.value }}</option>
              </select>
              <select name="end-time-dropdown" class="end-time-dropdown" v-model="selectedEndTime">
                <option v-for="(time, i) in endTimeDropdown" :key="i" :value="time.key">{{ time.value }}</option>
              </select>
              <mdicon class="add-new-subject-schedule" name="plus-circle-outline" @click="addNewSchedule" />
            </div>
            <div v-for="(schedule, i) in localSubject.schedule" :key="i" class="selected-datetimes">
              <h1 class="font-sans text-md">
                {{ schedule.day }}, {{ `${schedule.startTime.padStart(2, '0')}:00` }} to {{ `${schedule.endTime.padStart(2, '0')}:50` }}
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
            <button class="modal-close-button-footer" type="button" @click="$emit('update:editSubjectModalState', !editSubjectModalState)">
              Close
            </button>
            <button class="modal-accept-button" type="button" @click="submitSubject">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-background-color" v-if="editSubjectModalState"></div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, PropType, Ref, ref, toRefs, watch } from 'vue'

import { generateTimeSequence } from '@/helpers'
import { DayInWeek, Pair, Subject, TimeRange } from '@/types'

export default defineComponent({
  name: 'edit-subject-modal',
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
    'update:editSubjectModalState'
  ],
  setup (props, context) {
    const { subject: localSubject } = toRefs(props)

    const headerMessage = computed(() => {
      return localSubject.value.id || 'Edit Subject'
    })

    const daysInWeek: Ref<Array<string>> = ref(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
    const selectedDate: Ref<DayInWeek> = ref('Monday')
    const selectedStartTime: Ref<TimeRange> = ref('8')
    const selectedEndTime: Ref<TimeRange> = ref('8')
    const errorMessage: Ref<string> = ref('')

    const startTimeDropdown: Ref<Array<Pair<TimeRange, string>>> = ref(generateTimeSequence(8, 20, [12]).map(time => {
      return {
        key: time.toString() as TimeRange,
        value: `${time.toString().padStart(2, '0')}:00`
      }
    }))
    const endTimeDropdown: ComputedRef<Array<Pair<TimeRange, string>>> = computed(() => {
      return startTimeDropdown.value.map(time => {
        return {
          key: time.key,
          value: `${time.key.padStart(2, '0')}:50`
        }
      }).filter(time => Number(time.key) >= Number(selectedStartTime.value))
    })

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

      if (new Set(localSubject.value.schedule.map(schedule => schedule.day + schedule.startTime + schedule.endTime)).size < localSubject.value.schedule.length) {
        return 'Error: There\'s a duplicate in schedule date and time.'
      }
      return ''
    }

    const submitSubject = (): void => {
      if (validateInputs() !== '') {
        errorMessage.value = validateInputs()
        setTimeout(() => {
          errorMessage.value = ''
        }, 1000)
        return
      } else {
        errorMessage.value = ''
      }

      context.emit('update:editSubjectModalState', !props.editSubjectModalState)
    }

    watch(selectedStartTime, (value) => {
      if (Number(value) > Number(selectedEndTime.value)) {
        selectedEndTime.value = selectedStartTime.value
      }
    })

    return {
      startTimeDropdown,
      endTimeDropdown,
      selectedDate,
      selectedStartTime,
      selectedEndTime,
      daysInWeek,
      addNewSchedule,
      deleteSchedule,
      localSubject,
      validateInputs,
      errorMessage,
      submitSubject,
      headerMessage
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
  grid-template-columns: repeat(auto-fit, minmax(100px, 400px));
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

.subject-id-label, .subject-name-label, .subject-time-label {
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
</style>
