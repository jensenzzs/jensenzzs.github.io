<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { NConfigProvider, NButton, NInput } from 'naive-ui'
import {
    NSpace,
    NLayout,
    NSlider,
    NSelect,
    NInputNumber,
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
import { Note, Interval, Midi } from 'tonal'
import http from '@/utils/http'

const theme = ref<GlobalTheme | null>(lightTheme)
const locale = ref<NLocale | null>(zhCN)
const dateLocale = ref<NDateLocale | null>(dateZhCN)

let intervalNames = ['1P', '2M', '3M', '4P', '4A', '5d', '5P', '6M', '7M',]
const whiteKeyNoteList = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
const sharpNoteList = ['A#', 'B#', 'C#', 'D#', 'E#', 'F#', 'G#']
const flatNoteList = ['Ab', 'Bb', 'Cb', 'Db', 'Eb', 'Fb', 'Gb']
const sliderScope = [21, 100]
const soundfontOptions = [
    {
        label: "原声钢琴",
        value: "acoustic_grand_piano",
    },
    {
        label: "明亮原声钢琴",
        value: "bright_acoustic_piano",
    },
    {
        label: "电钢琴",
        value: "electric_grand_piano",
    },
    {
        label: "原声吉他",
        value: "acoustic_guitar_steel",
    }
]

const noteStr = ref('')
const soundfontsObj = ref({})
const soundfontName = ref('acoustic_grand_piano')
const soundfontLoaded = ref(false)
const bpm = ref(80)

let toneSampler: Tone.Sampler


const noteScope = ref([61, 71])
const pitchInterval = ref<string>("")
const intervalNotes = ref<string[]>([])

onMounted(() => {
    intervalNames = Interval.names()
    intervalNames.push('8P')
    console.log(intervalNames)
    const res = Note.transpose('C4', '4A')
    console.log(res)
    console.log(Midi.toMidi('A0'))
    console.log(Midi.toMidi('E7'))
})

watch(
    bpm,
    (value) => {
        if (!value) {
            return
        }
        Tone.Transport.bpm.value = value;
    },
    { deep: true }
);

function loadSoundfontsCache(): boolean {
    const localSf = localStorage.getItem('soundfonts:' + soundfontName.value)
    if (localSf) {
        soundfontsObj.value = JSON.parse(localSf);
        return true;
    }
    return false;
}

async function loadSoundfontsRemote() {
    const { data: res } = await http.get(
        `/midi-js-soundfonts/MusyngKite/${soundfontName.value}-mp3.js`
    )
    const returnCode = 'return MIDI.Soundfont.' + soundfontName.value
    const code = res + returnCode
    const soundfontFunc = new Function(code)
    soundfontsObj.value = soundfontFunc()
    localStorage['soundfonts:' + soundfontName.value] = JSON.stringify(soundfontsObj.value)
}

// Tone.js
// soundfonts by https://github.com/danigb/samples, bug lack samples！！！
// soundfonts by https://github.com/gleitz/midi-js-soundfonts/tree/gh-pages 稍做处理这个比较全
async function loadSoundfontsSampler() {
    const success = loadSoundfontsCache();
    if (!success) {
        await loadSoundfontsRemote()
    }
    // 加载采样
    toneSampler = new Tone.Sampler({
        // 支持根据url拼接
        // urls: {
        //   E3: 'PP-E3.ogg',
        //   G3: 'PP-G3.ogg'
        // },
        // baseUrl: 'https://danigb.github.io/samples/splendid-grand-piano/'

        // 支持base64编码
        // urls: {
        //   A0: 'data:audio/mp3;base64,//uQRAAAAVVVVVVU=',
        //   Bb0: 'data:audio/mp3;base64,//uQRAAAqqqqqqq'
        // }
        urls: soundfontsObj.value
    }).toDestination()

    Tone.loaded().then(() => {
        soundfontLoaded.value = true
    })
}

function playTone() {
    const now = Tone.now()
    // toneSampler.triggerAttack('C4', now)
    // toneSampler.triggerAttack('E4', now + 0.5)
    // toneSampler.triggerAttack('G4', now + 1)
    // toneSampler.triggerAttack('C5', now + 1.5)
    // toneSampler.triggerAttack('E5', now + 2)
    // toneSampler.triggerAttack(['C3', 'G3', 'E3'], now + 4)

    toneSampler.triggerAttack(intervalNotes.value, now)
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

    new Tone.Loop((time) => {
        intervalNotes.value = randomNoteInterval()

        toneSampler.triggerAttackRelease(intervalNotes.value, '2n', time)
    }, '1n').start(0)

    // all loops start until the Transport is started
    Tone.Transport.start()
}

function stop() {
    Tone.Transport.cancel()
    Tone.Transport.stop()
}

function randomNoteInterval(): [string, string] {
    const semitonesArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const semitone = randomListItem(semitonesArr);
    const minMidiValue = noteScope.value[0];
    const maxMidiValue = noteScope.value[1] - semitone;
    const randomMidiValue = randomBetween(minMidiValue, maxMidiValue)
    const node1 = Midi.midiToNoteName(randomMidiValue)
    pitchInterval.value = Interval.fromSemitones(semitone);
    const node2 = Note.transpose(node1, pitchInterval.value)
    return [node1, node2]
}


function randomListItem(list: any): any {
    const randomNumber = Math.floor(Math.random() * list.length)
    return list[randomNumber]
}

function randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
</script>

<template>
    <f7-page name="home">
        <f7-navbar title="Home"></f7-navbar>
        <!-- Page content -->

        <f7-link href="/about/">About Page</f7-link>
        <f7-link href="/login/">Login Page</f7-link>

        <n-config-provider :theme="theme" :locale="locale" :date-locale="dateLocale">
            <n-space vertical>
                <n-layout-header bordered style="height: 64px">
                    <RouterLink to="/about">about</RouterLink>
                    <n-button @click="theme = darkTheme"> 深色 </n-button>
                    <n-button @click="theme = lightTheme"> 浅色 </n-button>
                </n-layout-header>
                <n-layout-content ref="contentRef" content-style="padding: 0;" :native-scrollbar="false">
                    <!-- <n-input v-model:value="soundfontName" type="text" placeholder="请输入" /> -->
                    <n-select v-model:value="soundfontName" :options="soundfontOptions" />
                    <n-input-number v-model:value="bpm" :step="10" button-placement="both" />
                    <n-button @click="loadSoundfontsSampler"> 加载 tone </n-button>
                    <n-button @click="playTone" :disabled="!soundfontLoaded"> play tone </n-button>
                    <n-button @click="rendomNodeWithTone"> tone </n-button>
                    <n-button @click="stop"> 结束 </n-button>
                    <div>{{ noteStr }}</div>

                    <n-slider :format-tooltip="Midi.midiToNoteName" :min="sliderScope[0]" :max="sliderScope[1]"
                        v-model:value="noteScope" range :step="1">
                    </n-slider>
                    <div>{{ intervalNotes[0] + "---" + intervalNotes[1] }}</div>
                    <div>{{ pitchInterval }}</div>
                </n-layout-content>
            </n-space>
        </n-config-provider>
    </f7-page>
</template>