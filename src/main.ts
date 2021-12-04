// * TS expect error here is to escape an improper export from 'mdi-vue/v3'
// @ts-expect-error
import mdivue from 'mdi-vue/v3'
import { createApp } from 'vue'

import * as mdijs from '@mdi/js'

import Router from '@/router'
import Store from '@/store'
import App from './App.vue'

import './globals.scss'

createApp(App)
  .use(Router)
  .use(Store)
  .use(mdivue, { icons: mdijs as unknown as Record<string, string> })
  .mount('#app')
