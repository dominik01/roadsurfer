// src/components/__tests__/DayTile.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import DayTile from '../DayTile.vue'
import BookingItem from '../BookingItem.vue'
import { format } from 'date-fns'

// Mock the store module
const mockSelectedStation = vi.fn()
vi.mock('@/stores/stationStore', () => ({
  useStationStore: () => ({
    selectedStation: mockSelectedStation(),
  }),
}))

describe('DayTile', () => {
  const testDate = new Date('2023-01-15') // A Sunday

  // Sample bookings that overlap with the test date
  const mockBookings = [
    {
      id: '1',
      customerName: 'Start Only',
      startDate: '2023-01-15T09:00:00Z',
      endDate: '2023-01-16T17:00:00Z',
      pickupReturnStationId: '1',
    },
    {
      id: '2',
      customerName: 'End Only',
      startDate: '2023-01-14T09:00:00Z',
      endDate: '2023-01-15T17:00:00Z',
      pickupReturnStationId: '1',
    },
    {
      id: '3',
      customerName: 'Same Day',
      startDate: '2023-01-15T09:00:00Z',
      endDate: '2023-01-15T17:00:00Z',
      pickupReturnStationId: '1',
    },
  ]

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()
  })

  it('renders day name and number correctly', () => {
    // Setup store to return no bookings
    mockSelectedStation.mockReturnValue(null)

    const wrapper = mount(DayTile, {
      props: {
        date: testDate,
      },
    })

    expect(wrapper.find('.day-header').text()).toContain(format(testDate, 'EEE')) // Day name
    expect(wrapper.find('.day-header').text()).toContain(format(testDate, 'd')) // Day number
  })

  it('applies different styling for today', async () => {
    // Setup store to return no bookings
    mockSelectedStation.mockReturnValue(null)

    // Mock the current date to match our test date
    const realDate = Date
    global.Date = class extends Date {
      constructor(...args) {
        if (args.length === 0) {
          super(testDate.getTime())
        } else {
          super(...args)
        }
      }
    }

    const wrapper = mount(DayTile, {
      props: {
        date: testDate,
      },
    })

    expect(wrapper.find('.day-header').classes()).toContain('bg-primary')

    // Restore original Date
    global.Date = realDate
  })

  it('shows "No bookings" when there are no bookings', async () => {
    // Setup store to return station with no bookings
    mockSelectedStation.mockReturnValue({
      id: '1',
      name: 'Test Station',
      bookings: [],
    })

    const wrapper = mount(DayTile, {
      props: {
        date: testDate,
      },
    })

    // Wait for component to update
    await flushPromises()

    expect(wrapper.text()).toContain('No bookings')
  })

  it('renders booking items for the date', async () => {
    // Setup store to return station with bookings
    mockSelectedStation.mockReturnValue({
      id: '1',
      name: 'Test Station',
      bookings: mockBookings,
    })

    const wrapper = mount(DayTile, {
      props: {
        date: testDate,
      },
    })

    // Wait for component to update
    await flushPromises()

    // There should be 3 booking items (all our mock bookings interact with this date)
    expect(wrapper.findAllComponents(BookingItem).length).toBe(3)
  })

  it('emits booking-click event when a booking is clicked', async () => {
    // Setup store to return station with bookings
    mockSelectedStation.mockReturnValue({
      id: '1',
      name: 'Test Station',
      bookings: mockBookings,
    })

    const wrapper = mount(DayTile, {
      props: {
        date: testDate,
      },
    })

    // Wait for component to update
    await flushPromises()

    // Find the first booking item and simulate a click
    await wrapper.findComponent(BookingItem).vm.$emit('click', '1')

    // Check that the DayTile component emitted the booking-click event with the correct ID
    expect(wrapper.emitted('booking-click')).toBeTruthy()
    expect(wrapper.emitted('booking-click')[0]).toEqual(['1'])
  })
})
