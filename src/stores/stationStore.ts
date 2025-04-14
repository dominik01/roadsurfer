import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAllStations } from '@/api/common'
import type { Station } from '@/types'

export const useStationStore = defineStore('station', () => {
  const stations = ref<Station[]>([])
  const selectedStation = ref<Station | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchStations = async () => {
    if (stations.value.length) {
      return
    }
    isLoading.value = true
    error.value = null
    stations.value = []

    try {
      const data = await getAllStations()
      stations.value = data
    } catch (err) {
      error.value = 'Failed to fetch stations'
      console.error(error.value, err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    error,
    stations,
    fetchStations,
    selectedStation,
    isLoading,
  }
})
