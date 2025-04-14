import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import CalendarWeekView from '@/components/CalendarWeekView.vue'
import DayTile from '@/components/DayTile.vue'
import { useCalendarStore } from '@/stores/calendarStore'
import { searchStation } from '@/api/common'

// Mock the API module
vi.mock('@/api/common', () => ({
  searchStation: vi.fn(),
}))

// Mock child components
vi.mock('@/components/DayTile.vue', () => ({
  default: {
    name: 'DayTile',
    props: ['date'],
    template: '<div class="mock-day-tile"></div>',
  },
}))

vi.mock('@/components/AutocompleteSearch.vue', () => ({
  default: {
    name: 'Autocomplete',
    props: ['placeholder', 'searchFn'],
    template: '<div class="mock-autocomplete"></div>',
  },
}))

describe('CalendarWeekView.vue', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()

    // Reset date to a known value for consistent testing
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-04-15T12:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const createWrapper = () => {
    return mount(CalendarWeekView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
          }),
        ],
        stubs: {
          VueDatePicker: true,
          DayTile: true,
          Autocomplete: true,
        },
      },
    })
  }

  it('displays the correct week range', () => {
    const wrapper = createWrapper()
    const calendarStore = useCalendarStore()

    // Get formatted week range from the store
    expect(wrapper.find('h2').text()).toBe(calendarStore.formattedWeekRange)
  })

  it('navigates to previous week when prev button is clicked', async () => {
    const wrapper = createWrapper()
    const calendarStore = useCalendarStore()

    await wrapper.find('button:first-child').trigger('click')

    expect(calendarStore.prevWeek).toHaveBeenCalled()
  })

  it('navigates to next week when next button is clicked', async () => {
    const wrapper = createWrapper()
    const calendarStore = useCalendarStore()

    await wrapper.findAll('button')[2].trigger('click')

    expect(calendarStore.nextWeek).toHaveBeenCalled()
  })

  it('renders 7 DayTile components (one for each day of the week)', () => {
    const wrapper = createWrapper()

    const dayTiles = wrapper.findAll('.mock-day-tile')
    expect(dayTiles.length).toBe(7)
  })

  it('toggles date picker visibility when calendar icon is clicked', async () => {
    const wrapper = createWrapper()

    // Date picker should be hidden initially
    expect(wrapper.find('.z-10').exists()).toBe(false)

    // Click calendar icon button
    await wrapper.find('.btn-circle').trigger('click')

    // Date picker should be visible now
    expect(wrapper.find('.z-10').exists()).toBe(true)

    // Click again to hide
    await wrapper.find('.btn-circle').trigger('click')

    // Date picker should be hidden again
    expect(wrapper.find('.z-10').exists()).toBe(false)
  })

  it('emits booking-click event when a booking is clicked', async () => {
    const wrapper = createWrapper()

    // Simulate DayTile emitting booking-click event
    wrapper.vm.onBookingClick('booking-1')

    expect(wrapper.emitted('booking-click')).toBeTruthy()
    expect(wrapper.emitted('booking-click')[0]).toEqual(['booking-1'])
  })

  it('selects station when Autocomplete emits select event', async () => {
    const wrapper = createWrapper()
    const calendarStore = useCalendarStore()
    const station = { id: 'station-1', name: 'Test Station', bookings: [] }

    // Simulate Autocomplete emitting select event
    wrapper.vm.onStationSelect(station)

    expect(calendarStore.setSelectedStation).toHaveBeenCalledWith(station)
  })

  it('passes the search function to Autocomplete component', () => {
    const wrapper = createWrapper()

    // Ensure the searchStation function is passed to Autocomplete
    expect(wrapper.findComponent('.mock-autocomplete').props('searchFn')).toBe(searchStation)
  })
})
