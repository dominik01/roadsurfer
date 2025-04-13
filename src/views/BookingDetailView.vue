<template>
  <div class="booking-detail-view">
    <div class="mb-4">
      <button class="btn btn-primary btn-sm" @click="goBack">
        <span class="mr-1">←</span> Back to Calendar
      </button>
    </div>

    <div v-if="bookingStore.isLoading" class="flex justify-center my-8">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <div v-else-if="bookingStore.error" class="alert alert-error shadow-lg mb-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{{ bookingStore.error }}</span>
    </div>

    <div v-else-if="bookingStore.currentBooking" class="bg-white rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold mb-6">Booking Details</h1>

      <div class="card bg-base-100">
        <div class="card-body">
          <h2 class="card-title text-xl mb-6">{{ bookingStore.currentBooking.customerName }}</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="booking-info-item">
              <h3 class="text-sm font-semibold text-gray-500">Booking Start Date</h3>
              <p class="text-lg">{{ formatDate(bookingStore.currentBooking.startDate) }}</p>
            </div>

            <div class="booking-info-item">
              <h3 class="text-sm font-semibold text-gray-500">Booking End Date</h3>
              <p class="text-lg">{{ formatDate(bookingStore.currentBooking.endDate) }}</p>
            </div>

            <div class="booking-info-item">
              <h3 class="text-sm font-semibold text-gray-500">Booking Duration</h3>
              <p class="text-lg">{{ duration }} days</p>
            </div>

            <div class="booking-info-item">
              <h3 class="text-sm font-semibold text-gray-500">Pickup-Return Station</h3>
              <p class="text-lg">{{ bookingStore.currentBooking.stationName }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="bg-white rounded-lg shadow-md p-6 text-center">
      <div class="alert alert-error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Booking not found</span>
      </div>
      <button class="btn btn-primary mt-4" @click="goBack">Back to Calendar</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBookingStore } from '../stores/bookingStore'
import { format, parseISO, differenceInDays } from 'date-fns'

const router = useRouter()
const route = useRoute()
const bookingStore = useBookingStore()

const formatDate = (dateString: string) => {
  return format(parseISO(dateString), 'MMM d, yyyy h:mm a')
}

const duration = computed(() => {
  if (!bookingStore.currentBooking) return 0
  return (
    differenceInDays(
      parseISO(bookingStore.currentBooking.endDate),
      parseISO(bookingStore.currentBooking.startDate),
    ) + 1
  ) // Include both start and end days
})

const goBack = () => {
  router.push({ name: 'calendar' })
}

onMounted(async () => {
  const stationId = route.params.stationId as string
  const bookingId = route.params.bookingId as string
  await bookingStore.fetchBookingById(stationId, bookingId)
})
</script>
