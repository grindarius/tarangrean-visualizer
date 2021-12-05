<template>
  <div class="page-wrapper">
    <div class="container mx-auto p-3">
      <h1 class="text-3xl text-black font-sans mb-3">Subjects</h1>
      <div class="subject-list">
        <div
          class="subject-item"
          v-for="(subject, i) in subjects"
          :key="`subject-${i}`"
          :style="{ backgroundColor: subject.color }"
          @click="openEditSubjectModal(i)">
          <div class="subject-description" :style="{ backgroundColor: subject.color }">
            <h1 class="subject-id" :style="fontColor(i)">{{ subject.id }}</h1>
            <p class="subject-name" :style="fontColor(i)">{{ subject.name }}</p>
          </div>
        </div>
        <div class="add-subject" @click="openNewSubjectModal">
          <div class="subject-description">
            <mdicon name="plus-circle-outline" :width="30" :height="30" />
            <h1 class="subject-id">New Subject</h1>
          </div>
        </div>
      </div>
      <h1 class="text-3xl text-black font-sans my-3">Table</h1>
      <div class="subject-table-section">
        <table class="subject-table">
          <thead>
            <tr>
              <td v-for="(column, i) in topRow" :key="`top-row-${i}`">
                {{ column }}
              </td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(column, i) in body" :key="`table-body-${i}`">
              <td v-for="(cell, i) in column" :key="`table-cell-${i}`" :class="isHidden(cell)" :rowspan="getRowSpan(cell)" class="hour-cell">
                {{ writeToCell(cell, i) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <new-subject-modal
        v-model:new-subject-modal-state="newSubjectModalState"
        v-model:subjects="subjects">
      </new-subject-modal>
      <edit-subject-modal
        v-model:edit-subject-modal-state="editSubjectModalState"
        v-model:subject="selectedSubject"
        @remove-subject="removeSubject">
      </edit-subject-modal>
    </div>
  </div>
</template>

<script lang="ts">
import tinycolor from 'tinycolor2'
import { computed, defineComponent, Ref, ref } from 'vue'
import { Store, useStore } from 'vuex'

import EditSubjectModal from '@/components/edit-subject-modal.vue'
import NewSubjectModal from '@/components/new-subject-modal.vue'
import { generateTableBody, generateTableTopRow, isColorLight } from '@/helpers'
import { StoreVariables } from '@/store'
import { Subject, TableCell } from '@/types'

export default defineComponent({
  name: 'home',
  components: {
    'new-subject-modal': NewSubjectModal,
    'edit-subject-modal': EditSubjectModal
  },
  setup () {
    const store: Store<StoreVariables> = useStore()

    const subjects: Ref<Array<Subject>> = ref([])
    const selectedSubject: Ref<Subject> = ref({} as Subject)

    const newSubjectModalState = ref(false)
    const editSubjectModalState = ref(false)

    const topRow = ref(generateTableTopRow(store.state.userSelectedTimeSequence))
    const body = computed(() => generateTableBody(subjects.value, store.state.userSelectedTimeSequence))

    const openNewSubjectModal = (): void => {
      newSubjectModalState.value = !newSubjectModalState.value
    }

    const openEditSubjectModal = (i: number): void => {
      selectedSubject.value = subjects.value[i]
      editSubjectModalState.value = !editSubjectModalState.value
    }

    const removeSubject = (uid: string): void => {
      const index = subjects.value.findIndex((value) => value.uid === uid)
      subjects.value.splice(index, 1)
    }

    const fontColor = (index: number): { color: 'white' } | { color: 'black' } => {
      return isColorLight(tinycolor(subjects.value[index].color))
        ? { color: 'black' }
        : { color: 'white' }
    }

    const writeToCell = (cell: TableCell, index: number): string => {
      if (index === 0) {
        return cell.day
      }

      if (cell.subjects.length === 0) {
        return ''
      }

      return ''
    }

    const getRowSpan = (cell: TableCell): number => {
      if (cell.day === 'Sunday' && cell.lunch) {
        return 0
      } else {
        return 1
      }
    }

    const isHidden = (cell: TableCell): string => {
      if (cell.lunch && cell.day !== 'Sunday') {
        return 'hidden'
      } else {
        return ''
      }
    }

    return {
      openNewSubjectModal,
      subjects,
      topRow,
      body,
      newSubjectModalState,
      openEditSubjectModal,
      editSubjectModalState,
      selectedSubject,
      removeSubject,
      fontColor,
      writeToCell,
      getRowSpan,
      isHidden
    }
  }
})
</script>

<style scoped lang="scss">
.hour-cell {

}

.subject-list {
  @apply grid gap-4;
  grid-template-columns: repeat(auto-fit, minmax(150px, 300px));
}

.subject-item {
  @apply flex items-center justify-center rounded-xl h-32 text-center hover:border-blue-800 border-2 cursor-pointer border-blue-50;
}

.subject-description {
  @apply inline-block text-center;
}

.add-subject {
  @apply subject-item cursor-pointer border-2 border-white hover:border-blue-800 bg-white;
}

.subject-id {
  @apply text-xl font-sans font-bold break-words;
}

.subject-name {
  @apply text-base font-sans font-normal break-all;
}

.modal {
  @apply w-96 h-52 bg-black absolute top-1/2 left-1/2;
}

.page-wrapper {
  @apply w-full bg-gray-200;
  min-height: calc(100vh - 64px);
}

.subject-table-section {
  @apply overflow-x-auto;
}
.subject-table {
  @apply border-collapse m-2 w-11/12;

  tr, td {
    @apply border-black border-2 whitespace-nowrap text-center font-sans text-sm;
  }
}
</style>
