import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Booking, Station } from '../types'
import { mockStations } from '@/mocks/bookingService'

export const useBookingStore = defineStore('booking', () => {
  const stations = ref<Station[]>([])
  const currentBooking = ref<Booking | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchStations = async () => {
    isLoading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      stations.value = [...mockStations]
    } catch (err) {
      error.value = 'Failed to fetch stations'
      console.error(error.value, err)
    } finally {
      isLoading.value = false
    }
  }

  // Get all bookings from all stations
  const allBookings = computed(() => {
    return stations.value.flatMap((station) =>
      station.bookings.map((booking) => ({
        ...booking,
        stationName: station.name,
        stationId: station.id,
      })),
    )
  })

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

  // Get list of all station names for filter
  const stationNames = computed(() => {
    return stations.value.map((station) => ({
      id: station.id,
      name: station.name,
    }))
  })

  return {
    stations,
    allBookings,
    currentBooking,
    isLoading,
    error,
    stationNames,
    fetchStations,
    fetchBookingById,
  }
})
