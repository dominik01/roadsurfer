import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import BookingDetailView from '@/views/BookingDetailView.vue'
import { useBookingStore } from '@/stores/bookingStore'
import { format, parseISO, differenceInDays } from 'date-fns'

// Mock router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useRoute: () => ({
    params: {
      stationId: 'station-1',
      bookingId: 'booking-1',
    },
  }),
}))

describe('BookingDetailView.vue', () => {
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
          currentBooking: null,
          ...initialState,
        },
      },
    })

    // Get the store AFTER creating pinia
    const bookingStore = useBookingStore(pinia)

    return {
      wrapper: mount(BookingDetailView, {
        global: {
          plugins: [pinia],
        },
      }),
      bookingStore,
    }
  }

  it('shows loading indicator when data is loading', () => {
    const { wrapper } = createWrapper({ isLoading: true })

    expect(wrapper.find('.loading-spinner').exists()).toBe(true)
    expect(wrapper.find('.card').exists()).toBe(false)
  })

  it('shows error message when there is an error', () => {
    const { wrapper } = createWrapper({ error: 'Error fetching booking' })

    expect(wrapper.find('.alert-error').exists()).toBe(true)
    expect(wrapper.find('.alert-error').text()).toContain('Error fetching booking')
  })

  it('shows "booking not found" message when there is no current booking', () => {
    const { wrapper } = createWrapper({ currentBooking: null })

    expect(wrapper.find('.alert-error').exists()).toBe(true)
    expect(wrapper.find('.alert-error').text()).toContain('Booking not found')
  })

  it('displays booking details when booking is loaded', () => {
    const booking = {
      id: 'booking-1',
      customerName: 'John Doe',
      startDate: '2025-04-10T10:00:00',
      endDate: '2025-04-12T18:00:00',
      stationName: 'Test Station',
    }

    const { wrapper } = createWrapper({ currentBooking: booking })

    // Check that all booking details are displayed
    expect(wrapper.find('.card-title').text()).toBe('John Doe')
    expect(wrapper.find('.booking-info-item:nth-child(1) p').text()).toBe(
      format(parseISO(booking.startDate), 'MMM d, yyyy h:mm a'),
    )
    expect(wrapper.find('.booking-info-item:nth-child(2) p').text()).toBe(
      format(parseISO(booking.endDate), 'MMM d, yyyy h:mm a'),
    )

    // Calculate expected duration
    const duration = differenceInDays(parseISO(booking.endDate), parseISO(booking.startDate)) + 1
    expect(wrapper.find('.booking-info-item:nth-child(3) p').text()).toBe(`${duration} days`)

    expect(wrapper.find('.booking-info-item:nth-child(4) p').text()).toBe('Test Station')
  })

  it('calls fetchBookingById on mount with correct parameters', async () => {
    const { wrapper, bookingStore } = createWrapper()

    // Wait for the component to mount
    await flushPromises()

    expect(bookingStore.fetchBookingById).toHaveBeenCalledWith('station-1', 'booking-1')
  })

  it('navigates back to calendar view when back button is clicked', async () => {
    const { wrapper } = createWrapper()
    const router = vi.mocked(require('vue-router').useRouter())

    await wrapper.find('button').trigger('click')

    expect(router.push).toHaveBeenCalledWith({ name: 'calendar' })
  })

  it('navigates back to calendar view when "Back to Calendar" button is clicked in not found state', async () => {
    const { wrapper } = createWrapper({ currentBooking: null })
    const router = vi.mocked(require('vue-router').useRouter())

    // Find the second button (the one in the not found message)
    await wrapper.findAll('button')[1].trigger('click')

    expect(router.push).toHaveBeenCalledWith({ name: 'calendar' })
  })
})
