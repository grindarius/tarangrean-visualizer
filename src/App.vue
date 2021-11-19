<template>
  <nav class="navbar">
    <div class="navbar-wrapper container">
      <h1 class="font-sans text-2xl my-auto text-white">
        Tarangrean Visualizer
      </h1>
      <div class="navbar-end">
        <mdicon name="github" />
      </div>
    </div>
  </nav>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App'
})
</script>

<style lang="scss">
.navbar {
  @apply bg-blue-800 h-16 w-full block;
}

.navbar-wrapper {
  @apply h-16 mx-auto my-0 px-3 py-1 flex justify-between;
}

.navbar-end {
  @apply my-auto;
}

span.mdi-github > svg > path {
  fill: #ffffff;
}

.close-modal-icon > svg > path {
  fill: #EF4444;
}
</style>
