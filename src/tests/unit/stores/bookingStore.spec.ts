import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBookingStore } from '@/stores/bookingStore'
import { getBooking } from '@/api/common'

// Mock the API module
vi.mock('@/api/common', () => ({
  getBooking: vi.fn(),
}))

describe('bookingStore', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance and set it as active for each test
    setActivePinia(createPinia())

    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  it('fetches booking by ID successfully', async () => {
    const bookingStore = useBookingStore()
    const mockBooking = {
      id: '123',
      customerName: 'Test Customer',
      startDate: '2025-04-10T10:00:00',
      endDate: '2025-04-12T18:00:00',
      stationName: 'Test Station',
    }

    // Setup the mock to return our test data
    vi.mocked(getBooking).mockResolvedValue(mockBooking)

    // Call the method
    await bookingStore.fetchBookingById('station-1', '123')

    // Verify the API was called with correct parameters
    expect(getBooking).toHaveBeenCalledWith('station-1', '123')
    expect(getBooking).toHaveBeenCalledTimes(1)

    // Verify the state was updated properly
    expect(bookingStore.isLoading).toBe(false)
    expect(bookingStore.error).toBeNull()
    expect(bookingStore.currentBooking).toEqual(mockBooking)
  })

  it('handles API errors correctly', async () => {
    const bookingStore = useBookingStore()

    // Setup the mock to throw an error
    vi.mocked(getBooking).mockRejectedValue(new Error('API Error'))

    // Call the method
    await bookingStore.fetchBookingById('station-1', '123')

    // Verify the state was updated properly to reflect the error
    expect(bookingStore.isLoading).toBe(false)
    expect(bookingStore.error).toBe('Failed to fetch booking details')
    expect(bookingStore.currentBooking).toBeNull()
  })

  it('handles not found booking correctly', async () => {
    const bookingStore = useBookingStore()

    // Setup the mock to return null (booking not found)
    vi.mocked(getBooking).mockResolvedValue(null)

    // Call the method
    await bookingStore.fetchBookingById('station-1', '123')

    // Verify the state was updated properly
    expect(bookingStore.isLoading).toBe(false)
    expect(bookingStore.error).toBe('Booking with id 123 not found')
    expect(bookingStore.currentBooking).toBeNull()
  })

  it('sets loading state during API call', async () => {
    const bookingStore = useBookingStore()

    // Setup a delayed response to test loading state
    vi.mocked(getBooking).mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(null), 100)
      })
    })

    // Start the API call but don't await it
    const promise = bookingStore.fetchBookingById('station-1', '123')

    // Verify loading state is true during the call
    expect(bookingStore.isLoading).toBe(true)

    // Wait for the call to finish
    await promise

    // Verify loading state is false after the call
    expect(bookingStore.isLoading).toBe(false)
  })
})
