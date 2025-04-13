import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Booking, Station } from '../types'

export const useBookingStore = defineStore('booking', () => {
  const stations = ref<Station[]>([])
  const currentBooking = ref<Booking | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchBookingById = async (id: string) => {
    isLoading.value = true
    error.value = null
    currentBooking.value = null

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Find booking in any station
      for (const station of stations.value) {
        const booking = station.bookings.find((b) => b.id === id)
        if (booking) {
          currentBooking.value = {
            ...booking,
            stationName: station.name, // Add station name for convenience
            stationId: station.id,
          }
          break
        }
      }

      if (!currentBooking.value) {
        error.value = `Booking with id ${id} not found`
      }
    } catch (err) {
      error.value = 'Failed to fetch booking details'
      console.error(error.value, err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    currentBooking,
    isLoading,
    error,
    fetchBookingById,
  }
})
