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
      :class="status ? 'absolute hidden text-black font-sans pt-1 filter drop-shadow-lg' : 'absolute block text-black font-sans pt-1 filter drop-shadow-lg'"
      style="min-width: 12rem;">
      <li class="link-wrapper" v-for="(day, i) in daysInWeek" :key="`day-dropdown-${i}`">
        <div
          :class="selectedDate != null && day === localSelectedDate ? 'dropdown-selector selected' : 'dropdown-selector not-selected'"
          @click="onSelectDate(day)">
          {{ day }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, Ref, ref } from 'vue'

import { daysInWeek } from '@/constants'
import { DayInWeek } from '@/types'

export default defineComponent({
  name: 'day-dropdown',
  props: {
    selectedDate: {
      type: String as PropType<DayInWeek | undefined>,
      required: false
    }
  },
  emits: ['update:selectedDate'],
  setup (props, context) {
    const localSelectedDate = ref(props.selectedDate)
    const status: Ref<boolean> = ref(true)

    const toggleDropdown = (): void => {
      status.value = !status.value
    }

    const updateSelectedDate = (): void => {
      context.emit('update:selectedDate', localSelectedDate.value)
    }

    const onSelectDate = (newDate: DayInWeek): void => {
      if (localSelectedDate.value != null && localSelectedDate.value === newDate) {
        localSelectedDate.value = undefined
        updateSelectedDate()
        return
      }
      localSelectedDate.value = newDate
      updateSelectedDate()
    }

    const buttonWord = computed((): string => {
      if (localSelectedDate.value == null) {
        return 'Day'
      } else {
        return localSelectedDate.value
      }
    })

    return {
      status,
      toggleDropdown,
      localSelectedDate,
      onSelectDate,
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

.dropdown-toggle-button {
  @apply py-2 px-4 inline-flex items-center justify-between outline-none w-full ring-blue-500 bg-blue-500 rounded-lg h-9 text-white font-sans;
}

.dropdown-selector {
  @apply cursor-pointer py-2 px-4 block whitespace-nowrap;
}
</style>
