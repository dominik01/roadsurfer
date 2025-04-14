import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCalendarStore } from '@/stores/stationStore'
import { addDays, subDays, startOfWeek, format } from 'date-fns'

describe('calendarStore', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance and set it as active for each test
    setActivePinia(createPinia())

    // Reset date to a known value for consistent testing
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-04-15T12:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('initializes with current date', () => {
    const calendarStore = useCalendarStore()
    expect(calendarStore.currentDate).toEqual(new Date('2025-04-15T12:00:00'))
  })

  it('calculates week dates correctly starting from Monday', () => {
    const calendarStore = useCalendarStore()
    const monday = startOfWeek(calendarStore.currentDate, { weekStartsOn: 1 })

    // Get expected dates for the week
    const expectedDates = []
    for (let i = 0; i < 7; i++) {
      expectedDates.push(addDays(monday, i))
    }

    expect(calendarStore.weekDates).toEqual(expectedDates)
    expect(calendarStore.weekDates.length).toBe(7)

    // Verify first day is Monday and last is Sunday
    expect(format(calendarStore.weekDates[0], 'EEEE')).toBe('Monday')
    expect(format(calendarStore.weekDates[6], 'EEEE')).toBe('Sunday')
  })

  it('formats week range correctly when in same month', () => {
    const calendarStore = useCalendarStore()

    // Set date to a day where the whole week is in the same month
    calendarStore.currentDate = new Date('2025-04-15T12:00:00') // Mid-April

    const monday = startOfWeek(calendarStore.currentDate, { weekStartsOn: 1 })
    const sunday = addDays(monday, 6)

    const expectedRange = `${format(monday, 'MMM')} ${format(monday, 'd')} - ${format(sunday, 'd')}, ${format(monday, 'yyyy')}`
    expect(calendarStore.formattedWeekRange).toBe(expectedRange)
  })

  it('formats week range correctly when crossing months', () => {
    const calendarStore = useCalendarStore()

    // Set date to a day where the week crosses month boundary
    calendarStore.currentDate = new Date('2025-04-30T12:00:00') // End of April

    const monday = startOfWeek(calendarStore.currentDate, { weekStartsOn: 1 })
    const sunday = addDays(monday, 6)

    const expectedRange = `${format(monday, 'MMM')} ${format(monday, 'd')} - ${format(sunday, 'MMM')} ${format(sunday, 'd')}, ${format(monday, 'yyyy')}`
    expect(calendarStore.formattedWeekRange).toBe(expectedRange)
  })

  it('navigates to previous week correctly', () => {
    const calendarStore = useCalendarStore()
    const initialDate = new Date('2025-04-15T12:00:00')
    calendarStore.currentDate = initialDate

    calendarStore.prevWeek()

    const expectedDate = subDays(initialDate, 7)
    expect(calendarStore.currentDate).toEqual(expectedDate)
  })

  it('navigates to next week correctly', () => {
    const calendarStore = useCalendarStore()
    const initialDate = new Date('2025-04-15T12:00:00')
    calendarStore.currentDate = initialDate

    calendarStore.nextWeek()

    const expectedDate = addDays(initialDate, 7)
    expect(calendarStore.currentDate).toEqual(expectedDate)
  })

  it('sets selected station correctly', () => {
    const calendarStore = useCalendarStore()
    const station = {
      id: 'station-1',
      name: 'Test Station',
      bookings: [],
    }

    calendarStore.setSelectedStation(station)

    expect(calendarStore.selectedStation).toEqual(station)
  })
})
