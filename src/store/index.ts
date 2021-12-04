import { createStore } from 'vuex'

import { Time, UserSelectedTimeSequence } from '@/types'

export interface StoreVariables {
  userSelectedTimeSequence: Array<UserSelectedTimeSequence>
}

const store = createStore<StoreVariables>({
  state () {
    const userSelectedTimeSequence: Array<UserSelectedTimeSequence> = [
      {
        startTime: {
          hour: 8,
          minute: 0
        },
        endTime: {
          hour: 8,
          minute: 50
        },
        lunch: false
      },
      {
        startTime: {
          hour: 9,
          minute: 0
        },
        endTime: {
          hour: 9,
          minute: 50
        },
        lunch: false
      },
      {
        startTime: {
          hour: 10,
          minute: 0
        },
        endTime: {
          hour: 10,
          minute: 50
        },
        lunch: false
      },
      {
        startTime: {
          hour: 11,
          minute: 0
        },
        endTime: {
          hour: 11,
          minute: 50
        },
        lunch: false
      },
      {
        startTime: {
          hour: 12,
          minute: 0
        },
        endTime: {
          hour: 12,
          minute: 50
        },
        lunch: true
      },
      {
        startTime: {
          hour: 13,
          minute: 0
        },
        endTime: {
          hour: 13,
          minute: 50
        },
        lunch: false
      },
      {
        startTime: {
          hour: 14,
          minute: 0
        },
        endTime: {
          hour: 14,
          minute: 50
        },
        lunch: false
      },
      {
        startTime: {
          hour: 15,
          minute: 0
        },
        endTime: {
          hour: 15,
          minute: 50
        },
        lunch: false
      },
      {
        startTime: {
          hour: 16,
          minute: 0
        },
        endTime: {
          hour: 16,
          minute: 50
        },
        lunch: false
      },
      {
        startTime: {
          hour: 17,
          minute: 0
        },
        endTime: {
          hour: 17,
          minute: 50
        },
        lunch: false
      }
    ]

    return {
      userSelectedTimeSequence
    }
  },
  getters: {
    startTime (state): Array<Time> {
      return state.userSelectedTimeSequence
        .filter(seq => !seq.lunch)
        .map(time => {
          return {
            hour: time.startTime.hour,
            minute: time.startTime.minute
          }
        })
    },
    endTime (state): Array<Time> {
      return state.userSelectedTimeSequence
        .filter(seq => !seq.lunch)
        .map(time => {
          return {
            hour: time.endTime.hour,
            minute: time.endTime.minute
          }
        })
    },
    lunchTime (state): UserSelectedTimeSequence | undefined {
      return state.userSelectedTimeSequence.find(seq => seq.lunch)
    },
    timeSequenceLength (state): number {
      return state.userSelectedTimeSequence.length
    }
  },
  mutations: {
    add (state, payload: { newTime: UserSelectedTimeSequence }) {
      state.userSelectedTimeSequence.push(payload.newTime)
    },
    delete (state, payload: { position: number }) {
      state.userSelectedTimeSequence.splice(payload.position, 1)
    }
  }
})

export default store
