import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Booking, Station } from '../types'
import { mockStations } from '@/mocks/bookingService'
import { getStations } from '@/api/common'

export const useBookingStore = defineStore('booking', () => {
  const stations = ref<Station[]>([])
  const bookings = ref<Booking[]>([])
  const currentBooking = ref<Booking | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchStations = async () => {
    isLoading.value = true
    error.value = null
    try {
      //const data = await getStations()
      // stations.value = data
      await new Promise((resolve) => setTimeout(resolve, 500))
      stations.value = mockStations
    } catch (err) {
      stations.value = []
      error.value = 'Failed to fetch stations'
      console.error(error.value, err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchBookingById = async (id: string) => {
    isLoading.value = true
    error.value = null
    currentBooking.value = null

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const booking = mockBookings.find((b) => b.id === id)

      if (booking) {
        currentBooking.value = { ...booking }
      } else {
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
    bookings,
    currentBooking,
    isLoading,
    error,
    stations,
    fetchStations,
    fetchBookingById,
  }
})
