import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import CalendarView from '@/views/CalendarView.vue'
import CalendarWeekView from '@/components/CalendarWeekView.vue'
import { useBookingStore } from '@/stores/bookingStore'
import { useCalendarStore } from '@/stores/stationStore'

// Mock router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

// Mock child component
vi.mock('@/components/CalendarWeekView.vue', () => ({
  default: {
    name: 'CalendarWeekView',
    template: '<div class="mock-calendar-week-view"></div>',
  },
}))

describe('CalendarView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createWrapper = (initialState = {}) => {
    // Create the testing pinia first
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        booking: {
          isLoading: false,
          error: null,
          ...initialState.booking,
        },
        calendar: {
          selectedStation: { id: 'station-1', name: 'Test Station' },
          ...initialState.calendar,
        },
      },
    })

    // Get the stores AFTER creating pinia
    const bookingStore = useBookingStore(pinia)
    const calendarStore = useCalendarStore(pinia)

    return {
      wrapper: mount(CalendarView, {
        global: {
          plugins: [pinia],
          stubs: {
            CalendarWeekView: true,
          },
        },
      }),
      bookingStore,
      calendarStore,
    }
  }

  it('displays the page title correctly', () => {
    const { wrapper } = createWrapper()

    expect(wrapper.find('h1').text()).toBe('Booking dashboard')
  })

  it('shows loading indicator when data is loading', () => {
    const { wrapper } = createWrapper({ booking: { isLoading: true } })

    expect(wrapper.find('.loading-spinner').exists()).toBe(true)
    expect(wrapper.find('.mock-calendar-week-view').exists()).toBe(false)
  })

  it('shows error message when there is an error', () => {
    const { wrapper } = createWrapper({ booking: { error: 'Error loading data' } })

    expect(wrapper.find('.alert-error').exists()).toBe(true)
    expect(wrapper.find('.alert-error').text()).toContain('Error loading data')
  })

  it('renders CalendarWeekView when data is loaded successfully', () => {
    const { wrapper } = createWrapper()

    expect(wrapper.find('.mock-calendar-week-view').exists()).toBe(true)
  })

  it('navigates to booking detail when a booking is clicked', () => {
    const { wrapper } = createWrapper()
    const router = vi.mocked(require('vue-router').useRouter())

    // Simulate booking click from calendar week view
    wrapper.vm.navigateToBooking('booking-1')

    expect(router.push).toHaveBeenCalledWith({
      name: 'booking-detail',
      params: {
        bookingId: 'booking-1',
        stationId: 'station-1',
      },
    })
  })

  it('passes the correct parameters to router when navigating to booking details', () => {
    // Create wrapper with custom selected station
    const { wrapper } = createWrapper({
      calendar: {
        selectedStation: { id: 'custom-station', name: 'Custom Station' },
      },
    })
    const router = vi.mocked(require('vue-router').useRouter())

    // Simulate booking click with custom station
    wrapper.vm.navigateToBooking('booking-2')

    expect(router.push).toHaveBeenCalledWith({
      name: 'booking-detail',
      params: {
        bookingId: 'booking-2',
        stationId: 'custom-station',
      },
    })
  })
})
