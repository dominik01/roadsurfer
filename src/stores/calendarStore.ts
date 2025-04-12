import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { format, startOfWeek, addDays, subDays } from 'date-fns'

export const useCalendarStore = defineStore('calendar', () => {
  const currentDate = ref(new Date())
  const selectedStation = ref<string>('2')

  const weekDates = computed(() => {
    const monday = startOfWeek(currentDate.value, { weekStartsOn: 1 })

    const dates: Date[] = []
    for (let i = 0; i < 7; i++) {
      dates.push(addDays(monday, i))
    }

    return dates
  })

  const formattedWeekRange = computed(() => {
    const dates = weekDates.value
    const firstDay = dates[0]
    const lastDay = dates[dates.length - 1]

    // Using date-fns for consistent formatting
    const firstMonth = format(firstDay, 'MMM')
    const lastMonth = format(lastDay, 'MMM')

    const firstDate = format(firstDay, 'd')
    const lastDate = format(lastDay, 'd')

    const year = format(firstDay, 'yyyy')

    if (firstMonth === lastMonth) {
      return `${firstMonth} ${firstDate} - ${lastDate}, ${year}`
    } else {
      return `${firstMonth} ${firstDate} - ${lastMonth} ${lastDate}, ${year}`
    }
  })

  function prevWeek() {
    currentDate.value = subDays(currentDate.value, 7)
  }

  function nextWeek() {
    currentDate.value = addDays(currentDate.value, 7)
  }

  function setSelectedStation(station: string) {
    selectedStation.value = station
  }

  return {
    currentDate,
    selectedStation,
    weekDates,
    formattedWeekRange,
    prevWeek,
    nextWeek,
    setSelectedStation,
  }
})
