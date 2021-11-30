<template>
  <div class="inline-block relative">
    <button
      class="dropdown-toggle-button"
      @click="toggleDropdown">
      <span class="mr-1">
        {{ buttonWord }}
      </span>
      <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path fill="#fff" d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
      </svg>
    </button>
    <ul
      :class="status ? 'time-dropdown hidden' : 'time-dropdown block'"
      style="min-width: 12rem;">
      <li class="link-wrapper" v-for="(time, i) in localTimeArray" :key="`day-dropdown-${i}`">
        <div
          :class="localSelectedTime != null && isSameTime(time, localSelectedTime) ? 'dropdown-selector selected' : 'dropdown-selector not-selected'"
          @click="onSelectTime(time)">
          {{ timeSequenceString(time) }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, Ref, ref } from 'vue'

import { daysInWeek } from '@/constants'
import { createTimeSequenceString, isSameTime } from '@/helpers'
import { Time } from '@/types'

export default defineComponent({
  name: 'time-dropdown',
  props: {
    selectedTime: {
      type: Object as PropType<Time>,
      required: false
    },
    timeArray: {
      type: Array as PropType<Array<Time>>,
      required: true
    }
  },
  emits: ['update:selectedTime'],
  setup (props, context) {
    const localTimeArray: Ref<Array<Time>> = ref(props.timeArray)
    const localSelectedTime: Ref<Time | undefined> = ref(props.selectedTime)
    const status: Ref<boolean> = ref(true)

    const toggleDropdown = (): void => {
      status.value = !status.value
    }

    const updateSelectedTime = (): void => {
      context.emit('update:selectedTime', localSelectedTime.value)
    }

    const onSelectTime = (newTime: Time): void => {
      if (localSelectedTime.value != null && isSameTime(localSelectedTime.value, newTime)) {
        localSelectedTime.value = undefined
        updateSelectedTime()
        return
      }
      localSelectedTime.value = newTime
      updateSelectedTime()
    }

    const buttonWord = computed((): string => {
      if (localSelectedTime.value == null) {
        return 'Time'
      } else {
        return createTimeSequenceString(localSelectedTime.value)
      }
    })

    const timeSequenceString = (time: Time): string => {
      return createTimeSequenceString(time)
    }

    return {
      isSameTime,
      status,
      toggleDropdown,
      localTimeArray,
      localSelectedTime,
      timeSequenceString,
      onSelectTime,
      daysInWeek,
      buttonWord
    }
  }
})
</script>

<style scoped lang="scss">
.link-wrapper:first-child > div {
  @apply rounded-t;
}

.link-wrapper:last-child > div {
  @apply rounded-b
}

.selected {
  @apply bg-blue-50;
}

.not-selected {
  @apply bg-white;
}

.time-dropdown {
  @apply absolute text-black font-sans pt-1 filter drop-shadow-lg;
}

.dropdown-selector {
  @apply cursor-pointer py-2 px-4 block whitespace-nowrap;
}

.dropdown-toggle-button {
  @apply py-2 px-4 inline-flex items-center justify-between outline-none w-full ring-blue-500 bg-blue-500 rounded-lg h-9 text-white font-sans;
}
</style>
