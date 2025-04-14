// src/api/__tests__/common.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getAllStations, getStation, searchStation, getBooking } from '../common'
import type { Station, Booking } from '@/types'

// Mock data for tests
const mockStations: Station[] = [
  {
    id: '1',
    name: 'Station One',
    bookings: [],
  },
  {
    id: '2',
    name: 'Station Two',
    bookings: [],
  },
]

const mockStation: Station = {
  id: '1',
  name: 'Station One',
  bookings: [],
}

const mockBooking: Booking = {
  id: '123',
  customerName: 'Test Customer',
  startDate: '2023-01-01T10:00:00Z',
  endDate: '2023-01-03T15:00:00Z',
  pickupReturnStationId: '1',
}

// Mock global fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('API Common', () => {
  // Reset mocks before each test
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('getAllStations', () => {
    it('should fetch all stations successfully', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStations,
      })

      // Act
      const result = await getAllStations()

      // Assert
      expect(mockFetch).toHaveBeenCalledWith('https://605c94c36d85de00170da8b4.mockapi.io/stations')
      expect(result).toEqual(mockStations)
    })

    it('should throw error when fetch fails', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      // Act & Assert
      await expect(getAllStations()).rejects.toThrow('HTTP error! status: 500')
    })
  })

  describe('getStation', () => {
    it('should fetch station by id successfully', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStation,
      })

      // Act
      const result = await getStation('1')

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        'https://605c94c36d85de00170da8b4.mockapi.io/stations/1',
      )
      expect(result).toEqual(mockStation)
    })
  })

  describe('searchStation', () => {
    it('should search stations by name successfully', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockStation],
      })

      // Act
      const result = await searchStation('Station')

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        'https://605c94c36d85de00170da8b4.mockapi.io/stations?name=Station',
      )
      expect(result).toEqual([mockStation])
    })

    // Test for when search finds no results
    it('should return empty array when no matches are found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      const result = await searchStation('NonExistent')
      expect(result).toEqual([])
    })
  })

  describe('getBooking', () => {
    it('should fetch booking by id successfully', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockBooking,
      })

      // Act
      const result = await getBooking('1', '123')

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        'https://605c94c36d85de00170da8b4.mockapi.io/stations/1/bookings/123',
      )
      expect(result).toEqual(mockBooking)
    })
  })
})
