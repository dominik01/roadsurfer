<template>
  <div
    class="booking-item p-2 rounded-md text-xs cursor-pointer hover:bg-opacity-80 truncate"
    :class="{
      'bg-blue-200': isStart && !isEnd,
      'bg-green-200': !isStart && isEnd,
      'bg-purple-200': isStart && isEnd,
    }"
    @click="onClick"
  >
    <div class="font-medium truncate">{{ booking.customerName }}</div>
    <div v-if="isStart" class="text-xs">Start: {{ formatTime(booking.startDate) }}</div>
    <div v-if="isEnd" class="text-xs">End: {{ formatTime(booking.endDate) }}</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { format, parseISO } from 'date-fns'
import type { Booking } from '../types'

const props = defineProps<{
  booking: Booking
  currentDate: Date
  isStart: boolean
  isEnd: boolean
}>()

const emit = defineEmits<{
  (e: 'click', bookingId: string): void
}>()

const formatTime = (dateString: string): string => {
  return format(parseISO(dateString), 'h:mm a')
}

const onClick = () => {
  emit('click', props.booking.id)
}
</script>
