import tinycolor, { Instance } from 'tinycolor2'
import { Ref, ref } from 'vue'

import { randomColor } from '@/helpers'

interface UseSubjectColor {
  color: Ref<string>
  randomizePastelColor: () => void
}

export function useSubjectColor (): UseSubjectColor {
  const color = ref('#ffffff')

  const randomizePastelColor = (): void => {
    const randomedColor: Instance = randomColor()
    const saturatedColor: Instance = randomedColor.saturate(10)
    const mixedWithWhite: Instance = tinycolor.mix(saturatedColor, { r: 255, g: 255, b: 255 })

    color.value = mixedWithWhite.toHexString()
  }

  return {
    color,
    randomizePastelColor
  }
}
