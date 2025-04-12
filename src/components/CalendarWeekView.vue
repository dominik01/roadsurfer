<template>
  <div class="calendar-week-view mb-4">
    <div class="flex justify-between items-center mb-4">
      <button class="btn btn-sm btn-primary" @click="calendarStore.prevWeek">
        <span class="hidden md:inline">Previous Week</span>
        <span class="md:hidden">Prev</span>
      </button>
      <h2 class="text-lg md:text-xl font-bold">
        {{ calendarStore.formattedWeekRange }}
      </h2>
      <button class="btn btn-sm btn-primary" @click="calendarStore.nextWeek">
        <span class="hidden md:inline">Next Week</span>
        <span class="md:hidden">Next</span>
      </button>
    </div>

    <div v-if="bookingStore.stations.length > 0" class="mb-4">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-sm font-medium">Filter by station:</span>
        <div class="join">
          <button
            class="join-item btn btn-sm"
            :class="calendarStore.selectedStation === null ? 'btn-primary' : 'btn-outline'"
            @click="clearStationFilter"
          >
            All
          </button>
          <button
            v-for="station in bookingStore.stations"
            :key="station.id"
            class="join-item btn btn-sm"
            :class="calendarStore.selectedStation === station.id ? 'btn-primary' : 'btn-outline'"
            @click="setSelectedStation(station.id)"
          >
            {{ station.name }}
          </button>
        </div>
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
import { defineEmits } from 'vue'
import { useBookingStore } from '../stores/bookingStore'
import { useCalendarStore } from '../stores/calendarStore'
import DayTile from './DayTile.vue'

const emit = defineEmits<{
  (e: 'booking-click', bookingId: string): void
}>()

//const router = useRouter()
const bookingStore = useBookingStore()
const calendarStore = useCalendarStore()

const clearStationFilter = () => {
  calendarStore.selectedStation = null
}

const setSelectedStation = (station: string) => {
  calendarStore.selectedStation = station
}

const onBookingClick = (bookingId: string) => {
  emit('booking-click', bookingId)
}
</script>
