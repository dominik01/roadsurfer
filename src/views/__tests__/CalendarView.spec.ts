// src/views/__tests__/CalendarView.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import CalendarView from '@/views/CalendarView.vue'
import CalendarWeekView from '@/components/CalendarWeekView.vue'

// Mock the stores
const mockSelectedStation = vi.fn()
const mockBookingLoading = vi.fn()
const mockBookingError = vi.fn()

vi.mock('@/stores/stationStore', () => ({
  useStationStore: () => ({
    selectedStation: mockSelectedStation(),
  }),
}))

vi.mock('@/stores/bookingStore', () => ({
  useBookingStore: () => ({
    isLoading: mockBookingLoading(),
    error: mockBookingError(),
  }),
}))

// Mock the router
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
      component: {},
    },
  ],
})

describe('CalendarView', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Default mock values
    mockSelectedStation.mockReturnValue({ id: '1', name: 'Test Station', bookings: [] })
    mockBookingLoading.mockReturnValue(false)
    mockBookingError.mockReturnValue(null)
  })

  it('renders the page title correctly', () => {
    const wrapper = mount(CalendarView, {
      global: {
        plugins: [router],
        stubs: {
          CalendarWeekView: true,
        },
      },
    })

    expect(wrapper.find('h1').text()).toBe('Booking dashboard')
  })

  it('displays the selected station name', async () => {
    mockSelectedStation.mockReturnValue({ id: '1', name: 'Berlin Station', bookings: [] })

    const wrapper = mount(CalendarView, {
      global: {
        plugins: [router],
        stubs: {
          CalendarWeekView: true,
        },
      },
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Berlin Station')
  })

  it('displays "No station" when no station is selected', async () => {
    mockSelectedStation.mockReturnValue(null)

    const wrapper = mount(CalendarView, {
      global: {
        plugins: [router],
        stubs: {
          CalendarWeekView: true,
        },
      },
    })

    await flushPromises()

    expect(wrapper.text()).toContain('No station')
  })

  it('shows loading spinner when isLoading is true', async () => {
    mockBookingLoading.mockReturnValue(true)

    const wrapper = mount(CalendarView, {
      global: {
        plugins: [router],
        stubs: {
          CalendarWeekView: true,
        },
      },
    })

    await flushPromises()

    expect(wrapper.find('.loading-spinner').exists()).toBe(true)
    expect(wrapper.findComponent(CalendarWeekView).exists()).toBe(false)
  })

  it('shows error message when there is an error', async () => {
    mockBookingLoading.mockReturnValue(false)
    mockBookingError.mockReturnValue('Failed to load bookings')

    const wrapper = mount(CalendarView, {
      global: {
        plugins: [router],
        stubs: {
          CalendarWeekView: true,
        },
      },
    })

    await flushPromises()

    expect(wrapper.find('.alert-error').exists()).toBe(true)
    expect(wrapper.text()).toContain('Failed to load bookings')
    expect(wrapper.findComponent(CalendarWeekView).exists()).toBe(false)
  })

  it('renders CalendarWeekView when not loading and no errors', async () => {
    const wrapper = mount(CalendarView, {
      global: {
        plugins: [router],
        stubs: {
          CalendarWeekView: true,
        },
      },
    })

    await flushPromises()

    expect(wrapper.findComponent(CalendarWeekView).exists()).toBe(true)
  })

  it('navigates to booking detail when booking-click event is received', async () => {
    // Spy on router.push
    const routerPushSpy = vi.spyOn(router, 'push')

    const wrapper = mount(CalendarView, {
      global: {
        plugins: [router],
      },
    })

    // Simulate a booking click from the CalendarWeekView
    await wrapper.findComponent(CalendarWeekView).vm.$emit('booking-click', '123')

    // Check that router.push was called with the correct route
    expect(routerPushSpy).toHaveBeenCalledWith({
      name: 'booking-detail',
      params: { bookingId: '123', stationId: '1' },
    })
  })
})
