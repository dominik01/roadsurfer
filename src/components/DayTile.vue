<template>
  <div class="day-tile h-60 card shadow-sm rounded-md bg-white overflow-hidden flex flex-col">
    <div
      class="day-header p-2 text-center"
      :class="{ 'bg-primary text-primary-content': isToday, 'bg-gray-300': !isToday }"
    >
      <div class="text-sm font-bold">{{ dayName }}</div>
      <div class="text-lg font-bold">{{ dayNumber }}</div>
    </div>
    <div class="flex-grow p-1 overflow-y-auto">
      <div v-if="bookingsForDay.length === 0" class="text-xs text-gray-400 text-center mt-4">
        No bookings
      </div>
      <div v-for="bookingInfo in bookingsForDay" :key="bookingInfo.booking.id" class="mb-1">
        <BookingItem
          :booking="bookingInfo.booking"
          :current-date="date"
          :is-start="bookingInfo.isStart"
          :is-end="bookingInfo.isEnd"
          @click="onBookingClick"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
import { useCalendarStore } from '../stores/calendarStore'
import { format, parseISO, isSameDay } from 'date-fns'
import BookingItem from './BookingItem.vue'

const props = defineProps<{
  date: Date
}>()

const emit = defineEmits<{
  (e: 'booking-click', bookingId: string): void
}>()

const calendarStore = useCalendarStore()

const dayName = computed(() => format(props.date, 'EEE'))
const dayNumber = computed(() => format(props.date, 'd'))

const isToday = computed(() => {
  const today = new Date()
  return isSameDay(today, props.date)
})

const bookingsForDay = computed(() => {
  if (!calendarStore.selectedStation?.bookings) {
    return []
  }
  return calendarStore.selectedStation?.bookings
    .filter((booking) => {
      const startDate = parseISO(booking.startDate)
      const endDate = parseISO(booking.endDate)
      const isStart = isSameDay(startDate, props.date)
      const isEnd = isSameDay(endDate, props.date)

      // Only include if this booking starts or ends on this day
      return isStart || isEnd
    })
    .map((booking) => {
      const startDate = parseISO(booking.startDate)
      const endDate = parseISO(booking.endDate)
      const isStart = isSameDay(startDate, props.date)
      const isEnd = isSameDay(endDate, props.date)

      return { booking, isStart, isEnd }
    })
})

const onBookingClick = (bookingId: string) => {
  emit('booking-click', bookingId)
}
</script>
