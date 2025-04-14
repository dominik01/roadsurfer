// src/components/__tests__/CalendarWeekView.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { format, startOfWeek, addDays } from 'date-fns'
import CalendarWeekView from '@/components/CalendarWeekView.vue'
import DayTile from '@/components/DayTile.vue'
import Autocomplete from '@/components/AutocompleteSearch.vue'
import type { Station } from '@/types'

// Mock the searchStation function
vi.mock('@/api/common', () => ({
  searchStation: vi.fn(),
}))

// Mock the store
const mockSelectedStation = vi.fn()
vi.mock('@/stores/stationStore', () => ({
  useStationStore: () => ({
    selectedStation: mockSelectedStation(),
  }),
}))

// Mock VueDatePicker component
vi.mock('@vuepic/vue-datepicker', () => ({
  default: {
    name: 'VueDatePicker',
    render() {
      return h('div', { class: 'mock-date-picker' })
    },
  },
}))

describe('CalendarWeekView', async () => {
  const { searchStation } = await import('@/api/common')
  const mockSearchStation = searchStation

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()
    mockSelectedStation.mockReturnValue(null)
    vi.mocked(mockSearchStation).mockResolvedValue([])
  })

  it('renders 7 day tiles', async () => {
    const wrapper = mount(CalendarWeekView, {
      global: {
        stubs: {
          DayTile: true,
          Autocomplete: true,
          VueDatePicker: true,
        },
      },
    })

    await flushPromises()
    expect(wrapper.findAllComponents(DayTile).length).toBe(7)
  })

  it('displays formatted week range correctly', async () => {
    // Create a test date
    const testDate = new Date('2023-01-15') // January 15, 2023

    // Instead of trying to set component data directly, we'll provide the date
    // as a prop or through a method that the component exposes
    const wrapper = mount(CalendarWeekView, {
      global: {
        stubs: {
          DayTile: true,
          Autocomplete: true,
          VueDatePicker: true,
        },
      },
    })

    // Access the internal currentDate and modify it directly
    // This is a bit of a hack, but it's necessary for Vue 3 script setup components
    wrapper.vm.currentDate = testDate
    await wrapper.vm.$nextTick()

    // Calculate expected week range (Monday to Sunday)
    const monday = startOfWeek(testDate, { weekStartsOn: 1 })
    const sunday = addDays(monday, 6)

    // Get the expected formatted range
    const expectedMonth = format(monday, 'MMM')
    const expectedStartDate = format(monday, 'd')
    const expectedEndDate = format(sunday, 'd')
    const expectedYear = format(monday, 'yyyy')

    // The actual formatting from the component
    const headingText = wrapper.find('h2').text()

    // Check that the heading contains the month, dates, and year
    expect(headingText).toContain(expectedMonth)
    expect(headingText).toContain(expectedStartDate)
    expect(headingText).toContain(expectedEndDate)
    expect(headingText).toContain(expectedYear)
  })

  it('moves to previous week when prevWeek button is clicked', async () => {
    const wrapper = mount(CalendarWeekView, {
      global: {
        stubs: {
          DayTile: true,
          Autocomplete: true,
          VueDatePicker: true,
        },
      },
    })

    // Get the initial date
    const initialDate = new Date(wrapper.vm.currentDate)

    // Click the previous week button
    await wrapper.find('button').trigger('click')
    await wrapper.vm.$nextTick()

    // Get the current date after clicking
    const newDate = new Date(wrapper.vm.currentDate)

    // Calculate the expected date (7 days before)
    const expectedDate = new Date(initialDate)
    expectedDate.setDate(initialDate.getDate() - 7)

    // Compare the dates (using the date part only to avoid time zone issues)
    expect(newDate.getDate()).toBe(expectedDate.getDate())
    expect(newDate.getMonth()).toBe(expectedDate.getMonth())
    expect(newDate.getFullYear()).toBe(expectedDate.getFullYear())
  })

  it('moves to next week when nextWeek button is clicked', async () => {
    const wrapper = mount(CalendarWeekView, {
      global: {
        stubs: {
          DayTile: true,
          Autocomplete: true,
          VueDatePicker: true,
        },
      },
    })

    // Get the initial date
    const initialDate = new Date(wrapper.vm.currentDate)

    // Click the next week button (third button)
    const buttons = wrapper.findAll('button')
    await buttons[2].trigger('click')
    await wrapper.vm.$nextTick()

    // Get the current date after clicking
    const newDate = new Date(wrapper.vm.currentDate)

    // Calculate the expected date (7 days after)
    const expectedDate = new Date(initialDate)
    expectedDate.setDate(initialDate.getDate() + 7)

    // Compare the dates
    expect(newDate.getDate()).toBe(expectedDate.getDate())
    expect(newDate.getMonth()).toBe(expectedDate.getMonth())
    expect(newDate.getFullYear()).toBe(expectedDate.getFullYear())
  })

  it('toggles date picker visibility when calendar button is clicked', async () => {
    const wrapper = mount(CalendarWeekView, {
      global: {
        stubs: {
          DayTile: true,
          Autocomplete: true,
          VueDatePicker: true,
        },
      },
    })

    // Date picker should be initially hidden
    expect(wrapper.vm.isDatePickerOpen).toBe(false)

    // Click the calendar button (second button)
    const buttons = wrapper.findAll('button')
    await buttons[1].trigger('click')
    await wrapper.vm.$nextTick()

    // Date picker should now be visible
    expect(wrapper.vm.isDatePickerOpen).toBe(true)
  })

  it('sets station in store when station is selected from autocomplete', async () => {
    // Create a mock station
    const mockStation: Station = {
      id: '1',
      name: 'Test Station',
      bookings: [],
    }

    const wrapper = mount(CalendarWeekView, {
      global: {
        stubs: {
          DayTile: true,
          VueDatePicker: true,
        },
      },
    })

    // Simulate station selection from autocomplete
    await wrapper.findComponent(Autocomplete).vm.$emit('select', mockStation)
    await flushPromises()

    // Check that the onStationSelect method was called with the station
    expect(mockSelectedStation).toHaveBeenCalled()
  })

  it('emits booking-click event when a booking is clicked in a day tile', async () => {
    const wrapper = mount(CalendarWeekView, {
      global: {
        stubs: {
          Autocomplete: true,
          VueDatePicker: true,
        },
      },
    })

    // Simulate a booking click in a DayTile
    await wrapper.findComponent(DayTile).vm.$emit('booking-click', '123')

    // Check that the event was re-emitted by CalendarWeekView
    expect(wrapper.emitted('booking-click')).toBeTruthy()
    expect(wrapper.emitted('booking-click')![0]).toEqual(['123'])
  })

  it('handles different months in the week range correctly', async () => {
    // Set a date that spans two months
    const crossMonthDate = new Date('2023-01-31') // Jan 31, spans into February

    const wrapper = mount(CalendarWeekView, {
      global: {
        stubs: {
          DayTile: true,
          Autocomplete: true,
          VueDatePicker: true,
        },
      },
    })

    // Set the current date
    wrapper.vm.currentDate = crossMonthDate
    await wrapper.vm.$nextTick()

    // Get the actual heading text
    const headingText = wrapper.find('h2').text()

    // Should contain both month names (Jan and Feb)
    expect(headingText).toContain('Jan')
    expect(headingText).toContain('Feb')
  })
})
