<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as d3 from 'd3'
import ComboText from './graph/combo-text.vue'
import { useHookMan } from '@renderer/composables/hook-man'

const KEEP_SECONDS = 5
const PICK_INTERVAL = 20
const MAX_DATA_POINTS_IN_HISTORY = (1000 / PICK_INTERVAL) * KEEP_SECONDS

const peakValue = ref<number>(0)
const peakValues = ref<number[]>([])
const avgValue = ref<number>(0)

const { hookManInvokeFn, lootThresold } = useHookMan()

const chartEl = ref<SVGElement | null>(null)
const getPeakValue = async () => {
  const rowPercent = await window.electron.ipcRenderer.invoke('get-peak-value')
  peakValue.value = parseFloat((rowPercent * 100).toFixed(2))

  if (peakValues.value.length >= MAX_DATA_POINTS_IN_HISTORY) {
    peakValues.value.shift()
  }
  peakValues.value.push(peakValue.value)

  avgValue.value = d3.mean(peakValues.value) ?? 0

  // core value
  hookManInvokeFn(peakValue.value)

  updateChart()
}

const updateChart = () => {
  const svg = d3.select('#chart')
  const width = chartEl.value?.clientWidth ?? 0
  const height = chartEl.value?.clientHeight ?? 0

  svg.selectAll('*').remove()

  const g = svg.attr('width', width).attr('height', height).append('g')

  const x = d3
    .scaleLinear()
    .domain([0, MAX_DATA_POINTS_IN_HISTORY - 1])
    .range([0, width])
  const y = d3.scaleLinear().domain([-5, 105]).range([height, 0])

  const max = d3.max(peakValues.value) ?? 0

  const gradient = g
    .append('defs')
    .append('linearGradient')
    .attr('id', 'line-gradient')
    .attr('gradientUnits', 'userSpaceOnUse')
    .attr('x1', 0)
    .attr('y1', y(0))
    .attr('x2', 0)
    .attr('y2', y(max))

  gradient
    .selectAll('stop')
    .data([
      { offset: '0%', color: 'rgb(73,233,149)' },
      { offset: '100%', color: 'rgb(109,85,231)' }
    ])
    .enter()
    .append('stop')
    .attr('offset', (d) => d.offset)
    .attr('stop-color', (d) => d.color)

  const line = d3
    .line<number>()
    .x((_, i) => x(i))
    .y((d) => y(d))
    .curve(d3.curveBasis)

  g.append('path')
    .datum(peakValues.value)
    .attr('fill', 'none')
    .attr('stroke', 'url(#line-gradient)')
    .attr('stroke-width', 1.5)
    .attr('d', line)

  g.append('line')
    .attr('x1', 0)
    .attr('y1', y(lootThresold.value))
    .attr('x2', width)
    .attr('y2', y(lootThresold.value))
    .attr('stroke', '#333')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '0')
}

onMounted(async () => {
  const interval = setInterval(getPeakValue, PICK_INTERVAL)
  return () => clearInterval(interval)
})
</script>

<template>
  <section class="flex gap-3">
    <span class="text-neutral-300 text-[15px]">终端输出</span>
    <div class="container relative">
      <div class="absolute w-full h-full flex items-center justify-center pb-[3%]">
        <ComboText class="absolute" :value="avgValue"></ComboText>
      </div>
      <svg
        id="chart"
        ref="chartEl"
        class="w-full h-full p-0 m-0 bg-neutral-900 bg-opacity-50"
      ></svg>
    </div>

    <div class="flex flex-col gap-2">
      <div class="flex gap-2">
        <h1 class="text-cyan-200 opacity-75 font-thin text-[15px]">渔获阈值</h1>
        <p class="text-neutral-600 text-[15px]">高于阈值上钩</p>
      </div>

      <div class="relative w-[110px] overflow-hidden">
        <input
          v-model="lootThresold"
          type="number"
          max="100"
          min="1"
          class="num-input w-[110px] bg-neutral-800 px-2 py-1 focus:outline-neutral-800 outline-none rounded-md shadow-md text-neutral-300"
        />
        <div
          :style="{ opacity: `${lootThresold}%` }"
          class="absolute select-none transition-all shadow-md border-black duration-300 bg-gradient-to-b w-[4px] top-0 right-0 from-blue-200 rounded-r-md to-yellow-200 h-full"
        ></div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.container {
  @apply w-[240px] h-[150px] overflow-hidden p-0 m-0 border border-neutral-500 rounded-md border-opacity-15;
  background-image: linear-gradient(
      0deg,
      transparent 24%,
      rgba(0, 0, 0, 0.3) 25%,
      rgba(0, 0, 0, 0.3) 26%,
      transparent 27%,
      transparent 74%,
      rgba(0, 0, 0, 0.3) 75%,
      rgba(0, 0, 0, 0.3) 76%,
      transparent 77%
    ),
    linear-gradient(
      90deg,
      transparent 24%,
      rgba(0, 0, 0, 0.3) 25%,
      rgba(0, 0, 0, 0.3) 26%,
      transparent 27%,
      transparent 74%,
      rgba(0, 0, 0, 0.3) 75%,
      rgba(0, 0, 0, 0.3) 76%,
      transparent 77%
    );
  background-size: 20px 20px;
}

.num-input::-webkit-outer-spin-button,
.num-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
