<template>
  <div class="calendar-view">
    <div class="flex justify-between items-start">
      <h1 class="text-2xl font-bold mb-4">Booking dashboard</h1>
      <div class="flex items-center gap-x-1 mr-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-8"
        >
          <path
            fill-rule="evenodd"
            d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
            clip-rule="evenodd"
          />
        </svg>

        <span class="text-xl">{{ calendarStore.selectedStation?.name || 'No station' }}</span>
      </div>
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
    <div v-else>
      <CalendarWeekView @booking-click="navigateToBooking" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useBookingStore } from '../stores/bookingStore'
import { useCalendarStore } from '@/stores/calendarStore'
import CalendarWeekView from '../components/CalendarWeekView.vue'

const router = useRouter()
const bookingStore = useBookingStore()
const calendarStore = useCalendarStore()

const navigateToBooking = (bookingId: string) => {
  router.push({
    name: 'booking-detail',
    params: { bookingId: bookingId, stationId: calendarStore.selectedStation?.id },
  })
}
</script>
