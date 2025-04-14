<template>
  <div class="booking-detail-view">
    <!-- Back button with improved styling -->
    <div class="mb-6">
      <button
        class="btn btn-primary btn-sm shadow-md flex items-center gap-2 transition-all hover:translate-x-1"
        @click="goBack"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Calendar
      </button>
    </div>

    <!-- Loading state -->
    <div
      v-if="bookingStore.isLoading"
      class="flex flex-col items-center justify-center my-12 p-8 bg-white rounded-xl shadow-md"
    >
      <span class="loading loading-spinner loading-lg text-primary"></span>
      <p class="mt-4 text-gray-500">Loading booking details...</p>
    </div>

    <!-- Error state -->
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

    <!-- Booking details -->
    <div
      v-else-if="bookingStore.currentBooking"
      class="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <!-- Header with badge -->
      <div class="bg-primary text-primary-content p-6">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold">Booking Details</h1>
          <div
            class="badge badge-lg"
            :class="{
              'badge-success': bookingStatus === 'Active',
              'badge-info': bookingStatus === 'Upcoming',
              'badge-warning': bookingStatus === 'Finished',
            }"
          >
            {{ bookingStatus }}
          </div>
        </div>
      </div>

      <!-- Customer info section -->
      <div class="p-6 border-b border-gray-100">
        <div class="flex items-center gap-4">
          <div class="inline-block">
            <div
              class="bg-neutral text-neutral-content rounded-full w-16 h-16 flex items-center justify-center"
            >
              <span class="text-xl">{{
                getInitials(bookingStore.currentBooking.customerName)
              }}</span>
            </div>
          </div>
          <div>
            <h2 class="text-2xl font-bold">{{ bookingStore.currentBooking.customerName }}</h2>
            <div class="badge badge-ghost mt-1">
              Booking ID: #{{ bookingStore.currentBooking.id }}
            </div>
          </div>
        </div>
      </div>

      <!-- Booking details grid -->
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Start Date -->
          <div class="booking-info-card flex items-start gap-4">
            <div class="p-3 bg-primary/10 text-primary rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-gray-500">Booking Start Date</h3>
              <p class="text-lg font-medium">
                {{ formatDate(bookingStore.currentBooking.startDate) }}
              </p>
            </div>
          </div>

          <!-- End Date -->
          <div class="booking-info-card flex items-start gap-4">
            <div class="p-3 bg-primary/10 text-primary rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-gray-500">Booking End Date</h3>
              <p class="text-lg font-medium">
                {{ formatDate(bookingStore.currentBooking.endDate) }}
              </p>
            </div>
          </div>

          <!-- Duration -->
          <div class="booking-info-card flex items-start gap-4">
            <div class="p-3 bg-primary/10 text-primary rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-gray-500">Booking Duration</h3>
              <p class="text-lg font-medium">
                {{ duration }} {{ duration === 1 ? 'day' : 'days' }}
              </p>
            </div>
          </div>

          <!-- Station -->
          <div class="booking-info-card flex items-start gap-4">
            <div class="p-3 bg-primary/10 text-primary rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-gray-500">Pickup-Return Station</h3>
              <p class="text-lg font-medium">{{ stationName }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="p-6 bg-gray-50 flex flex-wrap gap-3 justify-end">
        <button class="btn btn-outline btn-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          Edit
        </button>
        <button class="btn btn-primary btn-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Print Details
        </button>
      </div>
    </div>

    <!-- Not found state -->
    <div v-else class="bg-white rounded-lg shadow-lg p-8 text-center">
      <div class="inline-flex p-4 rounded-full bg-error/10 text-error mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h2 class="text-xl font-bold mb-2">Booking Not Found</h2>
      <p class="text-gray-500 mb-6">
        The booking you're looking for doesn't exist or has been removed.
      </p>
      <button class="btn btn-primary" @click="goBack">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 12H5M12 19l-7-7 7-7"
          />
        </svg>
        Back to Calendar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBookingStore } from '../stores/bookingStore'
import { format, parseISO, differenceInDays } from 'date-fns'
import { useStationStore } from '@/stores/stationStore'
import { getStation } from '@/api/common'

const router = useRouter()
const route = useRoute()
const bookingStore = useBookingStore()
const stationStore = useStationStore()

const formatDate = (dateString: string) => {
  return format(parseISO(dateString), 'MMM d, yyyy h:mm a')
}

const bookingStatus = computed(() => {
  if (!bookingStore.currentBooking) return ''

  const now = new Date()
  const startDate = parseISO(bookingStore.currentBooking.startDate)
  const endDate = parseISO(bookingStore.currentBooking.endDate)

  if (now < startDate) {
    return 'Upcoming'
  } else if (now > endDate) {
    return 'Finished'
  } else {
    return 'Active'
  }
})

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
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

const stationName = ref('')

onMounted(async () => {
  const stationId = route.params.stationId as string
  const bookingId = route.params.bookingId as string

  await bookingStore.fetchBookingById(stationId, bookingId)
  const returnStationId = bookingStore?.currentBooking?.pickupReturnStationId

  if (returnStationId && stationStore.selectedStation?.id !== returnStationId) {
    const result = await getStation(returnStationId)
    stationName.value = result.name
  } else {
    stationName.value = stationStore.selectedStation?.name || 'Unknown station'
  }
})
</script>
