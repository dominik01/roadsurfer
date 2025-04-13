// components/CalendarWeekView.vue
<template>
  <div class="calendar-week-view mb-4">
    <div class="flex justify-between items-center mb-4 bg-white py-4 shadow rounded-md">
      <button class="btn btn-link ml-2" @click="calendarStore.prevWeek">
        <span class="hidden md:inline">Previous Week</span>
        <span class="md:hidden">Prev</span>
      </button>

      <div class="flex items-center gap-2">
        <h2 class="text-lg md:text-xl font-bold">
          {{ calendarStore.formattedWeekRange }}
        </h2>

        <div class="relative">
          <button
            class="btn btn-sm btn-ghost btn-circle"
            @click.stop="isDatePickerOpen = !isDatePickerOpen"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
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
          </button>

          <div
            v-if="isDatePickerOpen"
            class="absolute right-0 mt-2 bg-base-100 z-10 shadow-xl"
            @click.stop
            ref="datePickerRef"
          >
            <VueDatePicker
              v-model="calendarStore.currentDate"
              @update:model-value="isDatePickerOpen = false"
              :enable-time-picker="false"
              auto-apply
              :week-start="1"
              :teleport="false"
              :inline="true"
            />
          </div>
        </div>
      </div>

      <button class="btn btn-link mr-2" @click="calendarStore.nextWeek">
        <span class="hidden md:inline">Next Week</span>
        <span class="md:hidden">Next</span>
      </button>
    </div>

    <div v-if="bookingStore.stationNames.length > 0" class="mb-4">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-sm font-medium">Filter by station:</span>
        <Autocomplete
          placeholder="Search stations..."
          :search-fn="searchStation"
          @select="onStationSelect"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-7 gap-2">
      <div v-for="date in calendarStore.weekDates" :key="date.toISOString()" class="md:col-span-1">
        <DayTile :date="date" @booking-click="onBookingClick" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, ref, onMounted, onUnmounted } from 'vue'
import { useBookingStore } from '../stores/bookingStore'
import { useCalendarStore } from '../stores/calendarStore'
import { searchStation } from '@/api/common'
import type { Station } from '@/types'

// Import Vue Datepicker
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import DayTile from './DayTile.vue'
import Autocomplete from './AutocompleteSearch.vue'

const emit = defineEmits<{
  (e: 'booking-click', bookingId: string): void
}>()

const bookingStore = useBookingStore()
const calendarStore = useCalendarStore()

const isDatePickerOpen = ref(false)
const datePickerRef = ref<HTMLElement | null>(null)

const onBookingClick = (bookingId: string) => {
  emit('booking-click', bookingId)
}

// Close date picker when clicking outside
const clickOutside = (event: MouseEvent) => {
  if (
    isDatePickerOpen.value &&
    datePickerRef.value &&
    !datePickerRef.value.contains(event.target as Node)
  ) {
    isDatePickerOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', clickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', clickOutside)
})

const onStationSelect = (station: Station) => {
  calendarStore.setSelectedStation(station.id)
}
</script>
