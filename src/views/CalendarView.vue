<template>
  <div class="calendar-view">
    <h1 class="text-2xl font-bold mb-4">Calendar View</h1>
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
    <div v-else>
      <CalendarWeekView @booking-click="navigateToBooking" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '../stores/bookingStore'
import CalendarWeekView from '../components/CalendarWeekView.vue'

const router = useRouter()
const bookingStore = useBookingStore()

const navigateToBooking = (bookingId: string) => {
  router.push({ name: 'booking-detail', params: { id: bookingId } })
}

onMounted(async () => {
  await bookingStore.fetchStations()
})
</script>
