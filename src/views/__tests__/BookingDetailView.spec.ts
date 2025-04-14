// src/views/__tests__/BookingDetailView.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import BookingDetailView from '@/views/BookingDetailView.vue'
import { format, parseISO } from 'date-fns'

// Mock the API
vi.mock('@/api/common', () => ({
  getStation: vi.fn().mockResolvedValue({ id: '2', name: 'Munich Station', bookings: [] }),
}))

// Mock the stores
const mockCurrentBooking = vi.fn()
const mockBookingLoading = vi.fn()
const mockBookingError = vi.fn()
const mockFetchBookingById = vi.fn()
const mockSelectedStation = vi.fn()

vi.mock('@/stores/bookingStore', () => ({
  useBookingStore: () => ({
    currentBooking: mockCurrentBooking(),
    isLoading: mockBookingLoading(),
    error: mockBookingError(),
    fetchBookingById: mockFetchBookingById,
  }),
}))

vi.mock('@/stores/stationStore', () => ({
  useStationStore: () => ({
    selectedStation: mockSelectedStation(),
  }),
}))

// Setup router with mock route
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/calendar',
      name: 'calendar',
      component: {},
    },
    {
      path: '/booking/:stationId/:bookingId',
      name: 'booking-detail',
      component: BookingDetailView,
      props: true, // Enable props for route params
    },
  ],
})

describe('BookingDetailView', () => {
  // Sample booking for tests
  const mockBooking = {
    id: '123',
    customerName: 'John Doe',
    startDate: '2023-06-01T10:00:00Z',
    endDate: '2023-06-03T15:00:00Z',
    pickupReturnStationId: '1',
  }

  beforeEach(async () => {
    vi.clearAllMocks()

    // Set default mock return values
    mockCurrentBooking.mockReturnValue(mockBooking)
    mockBookingLoading.mockReturnValue(false)
    mockBookingError.mockReturnValue(null)
    mockFetchBookingById.mockResolvedValue(undefined)
    mockSelectedStation.mockReturnValue({ id: '1', name: 'Berlin Station', bookings: [] })

    // Set up the route params and wait for router to be ready
    router.push('/booking/1/123')
    await router.isReady()
  })

  it('calls fetchBookingById with correct parameters on mount', async () => {
    // Push to route with params before mounting the component
    router.push('/booking/1/123')
    await router.isReady()

    mount(BookingDetailView, {
      global: {
        plugins: [router],
      },
    })

    await flushPromises()

    expect(mockFetchBookingById).toHaveBeenCalledWith('1', '123')
  })

  it('displays loading state when booking is loading', async () => {
    mockBookingLoading.mockReturnValue(true)

    const wrapper = mount(BookingDetailView, {
      global: {
        plugins: [router],
      },
    })

    await flushPromises()

    expect(wrapper.find('.loading-spinner').exists()).toBe(true)
    expect(wrapper.text()).toContain('Loading booking details')
  })

  it('displays error message when there is an error', async () => {
    mockBookingLoading.mockReturnValue(false)
    mockBookingError.mockReturnValue('Failed to load booking')

    const wrapper = mount(BookingDetailView, {
      global: {
        plugins: [router],
      },
    })

    await flushPromises()

    expect(wrapper.find('.alert-error').exists()).toBe(true)
    expect(wrapper.text()).toContain('Failed to load booking')
  })

  it('shows customer name and booking ID', async () => {
    const wrapper = mount(BookingDetailView, {
      global: {
        plugins: [router],
      },
    })

    await flushPromises()

    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('Booking ID: #123')
  })

  it('correctly formats the booking dates', async () => {
    const wrapper = mount(BookingDetailView, {
      global: {
        plugins: [router],
      },
    })

    await flushPromises()

    const expectedStartDate = format(parseISO(mockBooking.startDate), 'MMM d, yyyy h:mm a')
    const expectedEndDate = format(parseISO(mockBooking.endDate), 'MMM d, yyyy h:mm a')

    expect(wrapper.text()).toContain(expectedStartDate)
    expect(wrapper.text()).toContain(expectedEndDate)
  })

  it('calculates and displays the correct booking duration', async () => {
    const wrapper = mount(BookingDetailView, {
      global: {
        plugins: [router],
      },
    })

    await flushPromises()

    // 3 days (June 1-3, inclusive)
    expect(wrapper.text()).toContain('3 days')
  })

  it('displays customer initials in the avatar', async () => {
    const wrapper = mount(BookingDetailView, {
      global: {
        plugins: [router],
      },
    })

    await flushPromises()

    // John Doe -> JD
    expect(wrapper.find('.bg-neutral.text-neutral-content').text()).toBe('JD')
  })

  it('displays booking status as Upcoming when start date is in the future', async () => {
    // Set a future date
    const futureBooking = {
      ...mockBooking,
      startDate: '2099-06-01T10:00:00Z',
      endDate: '2099-06-03T15:00:00Z',
    }
    mockCurrentBooking.mockReturnValue(futureBooking)

    const wrapper = mount(BookingDetailView, {
      global: {
        plugins: [router],
      },
    })

    await flushPromises()

    expect(wrapper.find('.badge-info').exists()).toBe(true)
    expect(wrapper.find('.badge-info').text()).toBe('Upcoming')
  })

  it('displays booking status as Finished when end date is in the past', async () => {
    // Set a past date
    const pastBooking = {
      ...mockBooking,
      startDate: '2020-06-01T10:00:00Z',
      endDate: '2020-06-03T15:00:00Z',
    }
    mockCurrentBooking.mockReturnValue(pastBooking)

    const wrapper = mount(BookingDetailView, {
      global: {
        plugins: [router],
      },
    })

    await flushPromises()

    expect(wrapper.find('.badge-warning').exists()).toBe(true)
    expect(wrapper.find('.badge-warning').text()).toBe('Finished')
  })

  it('displays booking status as Active when current date is between start and end', async () => {
    // Mock the current date to be between start and end dates
    const realDate = Date
    const mockDate = new Date('2023-06-02T12:00:00Z')
    global.Date = class extends Date {
      constructor(...args: any[]) {
        if (args.length === 0) {
          super(mockDate)
        } else {
          super(...args)
        }
      }
    } as DateConstructor

    const wrapper = mount(BookingDetailView, {
      global: {
        plugins: [router],
      },
    })

    await flushPromises()

    expect(wrapper.find('.badge-success').exists()).toBe(true)
    expect(wrapper.find('.badge-success').text()).toBe('Active')

    // Restore original Date
    global.Date = realDate
  })

  it('navigates back to calendar when back button is clicked', async () => {
    const routerPushSpy = vi.spyOn(router, 'push')

    const wrapper = mount(BookingDetailView, {
      global: {
        plugins: [router],
      },
    })

    await flushPromises()

    await wrapper.find('button').trigger('click')

    expect(routerPushSpy).toHaveBeenCalledWith({ name: 'calendar' })
  })

  it('shows "Not Found" state when no booking is returned', async () => {
    mockCurrentBooking.mockReturnValue(null)

    const wrapper = mount(BookingDetailView, {
      global: {
        plugins: [router],
      },
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Booking Not Found')
  })

  it('uses station name from API when station ID is different', async () => {
    // Set a different pickup/return station ID
    const differentStationBooking = {
      ...mockBooking,
      pickupReturnStationId: '2', // Different from selectedStation.id which is '1'
    }
    mockCurrentBooking.mockReturnValue(differentStationBooking)

    const wrapper = mount(BookingDetailView, {
      global: {
        plugins: [router],
      },
    })

    await flushPromises()

    // Should fetch and display Munich Station instead of Berlin Station
    expect(wrapper.text()).toContain('Munich Station')
  })
})
