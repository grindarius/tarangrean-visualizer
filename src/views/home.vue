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
            <h1 class="subject-name" :style="fontColor(i)">{{ subject.name }}</h1>
          </div>
        </div>
        <div class="add-subject" @click="openNewSubjectModal">
          <div class="subject-description">
            <mdicon name="plus-circle-outline" :width="30" :height="30" />
            <h1 class="subject-name">New Subject</h1>
          </div>
        </div>
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
import { defineComponent, Ref, ref } from 'vue'

import EditSubjectModal from '@/components/edit-subject-modal.vue'
import NewSubjectModal from '@/components/new-subject-modal.vue'
import { isColorLight } from '@/helpers'
import { Subject } from '@/types'

export default defineComponent({
  name: 'home',
  components: {
    'new-subject-modal': NewSubjectModal,
    'edit-subject-modal': EditSubjectModal
  },
  setup () {
    const subjects: Ref<Array<Subject>> = ref([])
    const selectedSubject: Ref<Subject> = ref({} as Subject)

    const newSubjectModalState = ref(false)
    const editSubjectModalState = ref(false)

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
        ? { color: 'white' }
        : { color: 'black' }
    }

    return {
      openNewSubjectModal,
      subjects,
      newSubjectModalState,
      openEditSubjectModal,
      editSubjectModalState,
      selectedSubject,
      removeSubject,
      fontColor
    }
  }
})
</script>

<style scoped lang="scss">
.subject-list {
  @apply grid gap-4;
  grid-template-columns: repeat(auto-fit, minmax(150px, 300px));
}

.subject-item {
  @apply flex items-center justify-center rounded-xl h-32 text-center hover:border-blue-800 border-2 cursor-pointer border-transparent;
}

.subject-description {
  @apply inline-block text-center;
}

.add-subject {
  @apply subject-item cursor-pointer border-2 border-white hover:border-blue-800 bg-white;
}

.subject-id {
  @apply text-xl font-sans font-bold;
}

.subject-name {
  @apply text-lg font-sans font-normal;
}

.modal {
  @apply w-96 h-52 bg-black absolute top-1/2 left-1/2;
}

.page-wrapper {
  @apply w-full bg-gray-200;
  min-height: calc(100vh - 64px);
}
</style>
