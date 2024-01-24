import JSURL from 'jsurl'
import { ref, computed, onBeforeMount, watch, nextTick } from 'vue'
import { defineStore } from 'pinia'
import { useUrlSearchParams } from '@vueuse/core'

const useStore = defineStore('store', () => {
  const searchParams = useUrlSearchParams()

  const groups = ref<Record<string, any>>({})
  const configs = ref<Record<string, any>>({})

  function addGroup(groupKey: string, value: {}) {
    groups.value[groupKey] = value
  }

  function addConfig(groupKey: string, value: {}) {
    configs.value[groupKey] = value
  }

  watch(
    groups,
    (groupsObj) => {
      if (groupsObj) {
        Object.entries(groupsObj).forEach(([key, value]) => {
          searchParams[key] = JSURL.stringify(value)
        })
      }
    },
    {
      deep: true
    }
  )

  return { groups, configs, addGroup, addConfig }
})

type Config = {
  initialValue?: {}
  hasFoo?: boolean
}

export function useGroup(key: string, config?: Config) {
  const searchParams = useUrlSearchParams()
  const store = useStore()
  const group = computed(() => store.groups[key])

  onBeforeMount(() => {
    if (config) {
      store.addConfig(key, config)

      let initialValue = config.initialValue || {}
      if (config.hasFoo) {
        initialValue = { ...initialValue, foo: 'bar' }
      }
      if (searchParams[key]) {
        initialValue = { ...initialValue, ...JSURL.parse(searchParams[key] as string) }
      }
      store.addGroup(key, initialValue)
    }
  })

  function setGroup(value: {}) {
    console.log('setGroup', key, value)
    store.groups[key] = { ...store.groups[key], ...value }
  }

  watch(
    () => searchParams[key],
    (next) => {
      if (next && typeof next === 'string') {
        setGroup(JSURL.parse(next))
      }
    }
  )

  return { group, setGroup }
}

export default useStore
