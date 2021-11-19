// * TS expect error here is to escape an improper export from 'mdi-vue/v3'
// @ts-expect-error
import mdivue from 'mdi-vue/v3'
import { createApp } from 'vue'

import * as mdijs from '@mdi/js'

import App from './App.vue'
import Router from './router'

import './globals.scss'

createApp(App).use(Router).use(mdivue, {
  icons: mdijs as unknown as Record<string, string>
}).mount('#app')
