<template>
  <div class="modal-background cursor-pointer" v-if="newSubjectModalState">
    <div class="modal">
      <!-- content -->
      <div class="modal-content">
        <!-- header -->
        <div class="modal-title">
          <h1>Create new subject</h1>
          <button class="modal-close-button" @click="$emit('update:newSubjectModalState', !newSubjectModalState)">
            <mdicon class="close-modal-icon" name="close-circle-outline" />
          </button>
        </div>
        <!-- body -->
        <div class="modal-body">
          <label for="subject-id" class="subject-id-label">Subject ID</label>
          <input type="text" name="subject-id" class="subject-id-input">
          <label for="subject-name" class="subject-name-label">Subject name</label>
          <input type="text" class="subject-name-input">
        </div>
        <!-- footer -->
        <div class="modal-footer">
          <button class="modal-close-button-footer" type="button" @click="$emit('update:newSubjectModalState', !newSubjectModalState)">
            Close
          </button>
          <button class="modal-accept-button" type="button" @click="$emit('update:newSubjectModalState', !newSubjectModalState)">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-background-color" v-if="newSubjectModalState"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'new-subject-modal',
  props: {
    newSubjectModalState: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  emits: ['update:newSubjectModalState']
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
  @apply relative w-auto my-6 mx-auto max-w-3xl;
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
  @apply relative px-5 py-3 flex-auto;
}

.modal-body-text {
  @apply my-4 text-gray-500 text-lg leading-relaxed;
}

.modal-footer {
  @apply flex items-center justify-end p-6 border-t border-solid border-gray-200 rounded-b;
}

.modal-close-button-footer {
  @apply text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150;
}

.modal-accept-button {
  @apply text-red-500 bg-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150;
}
</style>
