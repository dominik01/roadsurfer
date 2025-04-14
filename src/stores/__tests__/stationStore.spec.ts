// src/stores/__tests__/stationStore.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useStationStore } from '../stationStore'
import * as api from '@/api/common'
import type { Station } from '@/types'

vi.spyOn(console, 'error').mockImplementation(() => {})
// Mock the API
vi.mock('@/api/common', () => ({
  getAllStations: vi.fn(),
}))

describe('StationStore', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance and make it active
    setActivePinia(createPinia())

    // Reset mocks
    vi.clearAllMocks()
  })

  it('has correct initial state', () => {
    const store = useStationStore()

    expect(store.stations).toEqual([])
    expect(store.selectedStation).toBe(null)
  })

  it('successfully fetches all stations', async () => {
    // Arrange
    const mockStations: Station[] = [
      { id: '1', name: 'Station 1', bookings: [] },
      { id: '2', name: 'Station 2', bookings: [] },
    ]

    // Mock API response
    vi.mocked(api.getAllStations).mockResolvedValue(mockStations)

    // Act
    const store = useStationStore()
    await store.fetchStations()

    // Assert
    expect(api.getAllStations).toHaveBeenCalled()
    expect(store.stations).toEqual(mockStations)
  })

  it('handles API error when fetching stations', async () => {
    // Arrange
    vi.mocked(api.getAllStations).mockRejectedValue(new Error('API Error'))

    // Act
    const store = useStationStore()
    await store.fetchStations()

    // Assert
    expect(api.getAllStations).toHaveBeenCalled()
    expect(store.stations).toEqual([])
    expect(store.error).toBe('Failed to fetch stations')
  })

  it('does not fetch stations again if they are already loaded', async () => {
    // Arrange
    const mockStations: Station[] = [
      { id: '1', name: 'Station 1', bookings: [] },
      { id: '2', name: 'Station 2', bookings: [] },
    ]

    // Setup store with existing stations
    const store = useStationStore()
    store.stations = mockStations

    // Act
    await store.fetchStations()

    // Assert: API should not have been called
    expect(api.getAllStations).not.toHaveBeenCalled()
  })

  it('allows setting the selected station', () => {
    // Arrange
    const mockStation: Station = { id: '1', name: 'Station 1', bookings: [] }

    // Act
    const store = useStationStore()
    store.selectedStation = mockStation

    // Assert
    expect(store.selectedStation).toEqual(mockStation)
  })

  it('sets loading state during API call', async () => {
    // Arrange
    // Create a promise that we can resolve manually
    let resolvePromise: (value: Station[]) => void
    const mockPromise = new Promise<Station[]>((resolve) => {
      resolvePromise = resolve
    })

    vi.mocked(api.getAllStations).mockReturnValue(mockPromise)

    // Act
    const store = useStationStore()
    const fetchPromise = store.fetchStations()

    // Assert: Check loading state is true during the API call
    expect(store.isLoading).toBe(true)

    // Resolve the mock API call
    resolvePromise!([{ id: '1', name: 'Station 1', bookings: [] }])

    // Wait for the fetch to complete
    await fetchPromise

    // Assert: Check loading state is false after the API call
    expect(store.isLoading).toBe(false)
  })

  it('resets error state before starting a new fetch', async () => {
    // Arrange: First set an error state
    const store = useStationStore()
    store.error = 'Old error'

    // Mock API for a successful response
    const mockStations: Station[] = [{ id: '1', name: 'Station 1', bookings: [] }]
    vi.mocked(api.getAllStations).mockResolvedValue(mockStations)

    // Act: Clear existing stations to force a new fetch
    store.stations = []
    await store.fetchStations()

    // Assert: Error should be reset
    expect(store.error).toBe(null)
  })
})
