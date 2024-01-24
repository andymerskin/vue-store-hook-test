<script setup lang="ts">
import { useGroup } from './stores/store'

const a = useGroup('a', {
  initialValue: {
    hello: 'world'
  }
})

const b = useGroup('b', {
  initialValue: {
    llama: 'duck'
  },
  hasFoo: true
})

const groups = [a, b]

const displayValue = (group: any) => {
  return JSON.stringify(group.value, null, 2)
}

const addToGroups = () => {
  groups.forEach((group) => {
    group.setGroup({
      anotherKey: 'bear'
    })
  })
}
</script>

<template>
  <div class="p-4 space-y-4">
    <button @click="addToGroups">Add to groups</button>
    <div
      v-for="({ group }, index) in groups"
      :key="index"
      class="w-1/4 p-4 rounded-lg border border-gray-400"
    >
      <div>
        <pre>{{ displayValue(group) }}</pre>
      </div>
    </div>
  </div>
</template>
