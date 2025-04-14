import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getBooking } from '@/api/common'
import type { Booking } from '../types'

vi.spyOn(console, 'error').mockImplementation(() => {})

export const useBookingStore = defineStore('booking', () => {
  const currentBooking = ref<Booking | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchBookingById = async (stationId: string, bookingId: string) => {
    isLoading.value = true
    error.value = null
    currentBooking.value = null

    try {
      const data = await getBooking(stationId, bookingId)
      currentBooking.value = data

      if (!currentBooking.value) {
        error.value = `Booking with id ${bookingId} not found`
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
