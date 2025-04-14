// src/stores/__tests__/bookingStore.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBookingStore } from '../bookingStore'
import * as api from '@/api/common'
import type { Booking } from '@/types'

// Mock the API
vi.mock('@/api/common', () => ({
  getBooking: vi.fn(),
}))

describe('BookingStore', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance and make it active
    setActivePinia(createPinia())

    // Reset mocks
    vi.clearAllMocks()
  })

  it('has correct initial state', () => {
    const store = useBookingStore()

    expect(store.currentBooking).toBe(null)
    expect(store.isLoading).toBe(false)
    expect(store.error).toBe(null)
  })

  it('successfully fetches a booking', async () => {
    // Arrange
    const mockBooking: Booking = {
      id: '123',
      customerName: 'Test Customer',
      startDate: '2023-01-01T10:00:00Z',
      endDate: '2023-01-03T15:00:00Z',
      pickupReturnStationId: '1',
    }

    // Mock API response
    vi.mocked(api.getBooking).mockResolvedValue(mockBooking)

    // Act
    const store = useBookingStore()
    await store.fetchBookingById('1', '123')

    // Assert
    expect(api.getBooking).toHaveBeenCalledWith('1', '123')
    expect(store.currentBooking).toEqual(mockBooking)
    expect(store.isLoading).toBe(false)
    expect(store.error).toBe(null)
  })

  it('handles API error when fetching a booking', async () => {
    // Arrange
    vi.mocked(api.getBooking).mockRejectedValue(new Error('API Error'))

    // Act
    const store = useBookingStore()
    await store.fetchBookingById('1', '123')

    // Assert
    expect(api.getBooking).toHaveBeenCalledWith('1', '123')
    expect(store.currentBooking).toBe(null)
    expect(store.isLoading).toBe(false)
    expect(store.error).toBe('Failed to fetch booking details')
  })

  it('sets loading state during API call', async () => {
    // Arrange
    // Create a promise that we can resolve manually
    let resolvePromise: (value: Booking) => void
    const mockPromise = new Promise<Booking>((resolve) => {
      resolvePromise = resolve
    })

    vi.mocked(api.getBooking).mockReturnValue(mockPromise)

    // Act
    const store = useBookingStore()
    const fetchPromise = store.fetchBookingById('1', '123')

    // Assert: Check loading state is true during the API call
    expect(store.isLoading).toBe(true)

    // Resolve the mock API call
    resolvePromise!({
      id: '123',
      customerName: 'Test Customer',
      startDate: '2023-01-01T10:00:00Z',
      endDate: '2023-01-03T15:00:00Z',
      pickupReturnStationId: '1',
    })

    // Wait for the fetch to complete
    await fetchPromise

    // Assert: Check loading state is false after the API call
    expect(store.isLoading).toBe(false)
  })

  it('resets state before starting a new fetch', async () => {
    // Arrange: First set some state
    const store = useBookingStore()
    store.currentBooking = {
      id: 'old',
      customerName: 'Old Customer',
      startDate: '2023-01-01T10:00:00Z',
      endDate: '2023-01-03T15:00:00Z',
      pickupReturnStationId: '1',
    } as Booking
    store.error = 'Old error'

    // Mock API for a successful response
    const mockBooking: Booking = {
      id: 'new',
      customerName: 'New Customer',
      startDate: '2023-01-01T10:00:00Z',
      endDate: '2023-01-03T15:00:00Z',
      pickupReturnStationId: '1',
    }
    vi.mocked(api.getBooking).mockResolvedValue(mockBooking)

    // Act
    await store.fetchBookingById('1', 'new')

    // Assert: State should be reset and then updated with new data
    expect(store.currentBooking).toEqual(mockBooking)
    expect(store.error).toBe(null)
  })

  it('sets error when API returns null booking', async () => {
    // Arrange: API returns null (unusual but possible)
    vi.mocked(api.getBooking).mockResolvedValue(null as unknown as Booking)

    // Act
    const store = useBookingStore()
    await store.fetchBookingById('1', '123')

    // Assert
    expect(store.currentBooking).toBe(null)
    expect(store.error).toBe('Booking with id 123 not found')
  })
})
