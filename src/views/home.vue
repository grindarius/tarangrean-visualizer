<template>
  <div class="page-wrapper">
    <div class="container mx-auto p-3">
      <h1 class="text-3xl text-black font-sans mb-2">Subjects</h1>
      <div class="subject-list">
        <div class="subject-item" v-for="(_, i) in subjectTemplate" :key="`subject-${i}`">
          <div class="subject-description">
            <h1 class="subject-id">{{ _.id }}</h1>
            <h1 class="subject-name">{{ _.name }}</h1>
          </div>
        </div>
        <div class="add-subject" @click="openNewSubjectModal">
          <div class="subject-description">
            <mdicon name="plus-circle-outline" :width="30" :height="30" />
            <h1 class="subject-name">New Subject</h1>
          </div>
        </div>
      </div>
    <new-subject-modal v-model:new-subject-modal-state="newSubjectModalState"></new-subject-modal>
    </div>
  </div>
</template>

<script lang="ts">
import dayjs from 'dayjs'
import { defineComponent, Ref, ref } from 'vue'

import NewSubjectModal from '@/components/new-subject-modal.vue'
import { Subject } from '@/types'

export default defineComponent({
  name: 'home',
  components: {
    'new-subject-modal': NewSubjectModal
  },
  setup () {
    const subjectTemplate: Ref<Array<Subject>> = ref([
      {
        id: '22331',
        name: 'xbox programming',
        startTime: dayjs().startOf('day').add(9, 'hours'),
        endTime: dayjs().startOf('day').add(11, 'hours')
      }
    ])
    const newSubjectModalState = ref(false)

    const openNewSubjectModal = (): void => {
      newSubjectModalState.value = !newSubjectModalState.value
    }

    return {
      openNewSubjectModal,
      subjectTemplate,
      newSubjectModalState
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
  @apply flex items-center justify-center rounded-xl bg-white h-32 text-center;
}

.subject-description {
  @apply inline-block text-center;
}

.add-subject {
  @apply subject-item cursor-pointer border-2 border-white hover:border-blue-800;
}

.subject-id {
  @apply text-xl font-sans font-bold text-current;
}

.subject-name {
  @apply text-lg font-sans font-normal text-current;
}

.modal {
  @apply w-96 h-52 bg-black absolute top-1/2 left-1/2;
}

.page-wrapper {
  @apply w-full bg-gray-100;
  min-height: calc(100vh - 64px);
}
</style>
