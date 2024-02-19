<script setup lang="ts">
import { ref } from 'vue'
import { NConfigProvider, NButton, NInput} from 'naive-ui'
import {
  NSpace,
  NLayout,
  NLayoutSider,
  NLayoutHeader,
  NLayoutContent,
  NLayoutFooter
} from 'naive-ui'
import { darkTheme, lightTheme } from 'naive-ui'
import { zhCN, dateZhCN } from 'naive-ui'
import type { GlobalTheme } from 'naive-ui'
import type { NLocale, NDateLocale } from 'naive-ui'

import * as Tone from 'tone'
import http from '@/utils/http'

const theme = ref<GlobalTheme | null>(darkTheme)
const locale = ref<NLocale | null>(zhCN)
const dateLocale = ref<NDateLocale | null>(dateZhCN)

const noteList = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G'
  //   'A#',
  //   'B#',
  //   'C#',
  //   'D#',
  //   'E#',
  //   'F#',
  //   'G#',
  //   'Ab',
  //   'Bb',
  //   'Cb',
  //   'Db',
  //   'Eb',
  //   'Fb',
  //   'Gb'
]
const noteStr = ref('')
const soundfontName = ref('acoustic_guitar_steel')
const soundfontLoaded = ref(false)

let toneSampler: Tone.Sampler

// Tone.js
// soundfonts by https://github.com/danigb/samples, bug lack samples！！！
// soundfonts by https://github.com/gleitz/midi-js-soundfonts/tree/gh-pages 稍做处理这个比较全
async function loadSoundfonts() {
  const { data: res } = await http.get(
    `https://jensenzzs.github.io/midi-js-soundfonts/MusyngKite/${soundfontName.value}-mp3.js`
  )
  const returnCode = 'return MIDI.Soundfont.' + soundfontName.value
  const code = res + returnCode
  const soundfontFunc = new Function(code)
  const noteBase64 = soundfontFunc()
  // 采样
  toneSampler = new Tone.Sampler({
    // 支持根据url拼接
    // urls: {
    //   C4: 'PP-C4.ogg',
    //   // 'D#4': 'PP-D#4.ogg',
    //   // 'F#4': 'PP-F#4.ogg',
    //   A4: 'PP-A4.ogg',
    //   C3: 'PP-C3.ogg',
    //   E3: 'PP-E3.ogg',
    //   G3: 'PP-G3.ogg'
    // },
    // baseUrl: 'https://danigb.github.io/samples/splendid-grand-piano/'

    // 支持base64编码
    // urls: {
    //   A0: 'data:audio/mp3;base64,//uQRAAAAVVVVVVU=',
    //   Bb0: 'data:audio/mp3;base64,//uQRAAAqqqqqqq'
    // }

    urls: noteBase64
  }).toDestination()

  Tone.loaded().then(() => {
    soundfontLoaded.value = true
  })
}

function playTone() {
  const now = Tone.now()
  toneSampler.triggerAttack('C4', now)
  toneSampler.triggerAttack('E4', now + 0.5)
  toneSampler.triggerAttack('G4', now + 1)
  toneSampler.triggerAttack('C5', now + 1.5)
  toneSampler.triggerAttack('E5', now + 2)
  toneSampler.triggerAttack(['C3', 'G3', 'E3'], now + 4)
}

async function rendomNodeWithTone() {
  Tone.start()
  // create two monophonic synths
  // const synthA = new Tone.FMSynth().toDestination()
  // const synthB = new Tone.AMSynth().toDestination()
  //play a note every quarter-note
  // const loopA = new Tone.Loop((time) => {
  //   toneSampler.triggerAttackRelease('C3', '4n', time)
  // }, '4n').start(0)
  //play another note every off quarter-note, by starting it "8n"

  const loopB = new Tone.Loop((time) => {
    const randomNumber = Math.floor(Math.random() * noteList.length)
    noteStr.value = noteList[randomNumber]
    toneSampler.triggerAttackRelease(noteStr.value + '4', '2n', time)
  }, '1n').start(0)
  // all loops start until the Transport is started
  Tone.Transport.start()
}

function stop() {
  Tone.Transport.cancel()
  Tone.Transport.stop()
}
</script>

<template>
  <n-config-provider :theme="theme" :locale="locale" :date-locale="dateLocale">
    <n-space vertical>
      <n-layout style="height: 100vh">
        <n-layout-header bordered style="height: 64px">
          <n-button @click="theme = darkTheme"> 深色 </n-button>
          <n-button @click="theme = lightTheme"> 浅色 </n-button>
        </n-layout-header>
        <n-layout
          has-sider
          sider-placement="right"
          position="absolute"
          style="top: 64px; bottom: 64px"
        >
          <n-layout-content ref="contentRef" content-style="padding: 0;" :native-scrollbar="false">
            <n-input v-model:value="soundfontName" type="text" placeholder="请输入" />
            <n-button @click="loadSoundfonts"> 加载 tone </n-button>
            <n-button @click="playTone" :disabled="!soundfontLoaded"> play tone </n-button>
            <n-button @click="rendomNodeWithTone"> tone </n-button>
            <n-button @click="stop"> 结束 </n-button>
            <div>{{ noteStr }}</div>
          </n-layout-content>

          <n-layout-sider
            ref="siderRef"
            collapse-mode="transform"
            :collapsed-width="20"
            :width="240"
            show-trigger="arrow-circle"
            bordered
            content-style="padding: 24px;"
          >
          </n-layout-sider>
        </n-layout>
        <n-layout-footer bordered position="absolute" style="height: 64px; padding: 24px"
          >footer</n-layout-footer
        >
      </n-layout>
    </n-space>
  </n-config-provider>
</template>

<style scoped>
main {
  height: 100vh;
  width: 100vh;
}
</style>
