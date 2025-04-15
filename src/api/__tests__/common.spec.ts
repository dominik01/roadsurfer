// src/api/__tests__/common.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getAllStations, getStation, searchStation, getBooking, checkForErrors } from '../common'
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

  describe('checkForErrors', () => {
    it('should parse JSON response correctly', async () => {
      // Arrange
      const mockResponse = {
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue('application/json'),
        },
        text: vi.fn().mockResolvedValue(JSON.stringify(mockStation)),
      }

      // Act
      const result = await checkForErrors(mockResponse)

      // Assert
      expect(result).toEqual(mockStation)
    })

    it('should handle HTTP errors with additional error details', async () => {
      // Arrange
      const errorData = { error: 'Not found', message: 'Station does not exist' }
      const mockResponse = {
        ok: false,
        status: 404,
        json: vi.fn().mockResolvedValue(errorData),
        headers: {
          get: vi.fn().mockReturnValue('application/json'),
        },
      }

      // Act & Assert
      try {
        await checkForErrors(mockResponse)
        // Should not reach here
        expect(true).toBe(false)
      } catch (err) {
        const error = err as Error & { status?: number; data?: any }
        expect(error.message).toContain('HTTP error! status: 404')
        expect(error.message).toContain('Station does not exist')
        expect(error.status).toBe(404)
        expect(error.data).toEqual(errorData)
      }
    })

    it('should handle basic HTTP errors when no additional details available', async () => {
      // Arrange
      const mockResponse = {
        ok: false,
        status: 500,
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
        headers: {
          get: vi.fn().mockReturnValue('text/html'),
        },
      }

      // Act & Assert
      try {
        await checkForErrors(mockResponse)
        // Should not reach here
        expect(true).toBe(false)
      } catch (err) {
        const error = err as Error & { status?: number }
        expect(error.message).toBe('HTTP error! status: 500')
        expect(error.status).toBe(500)
      }
    })

    it('should reject non-JSON content types', async () => {
      // Arrange
      const mockResponse = {
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue('text/html'),
        },
      }

      // Act & Assert
      await expect(checkForErrors(mockResponse)).rejects.toThrow('Response is not JSON')
    })

    it('should handle empty responses', async () => {
      // Arrange
      const mockResponse = {
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue('application/json'),
        },
        text: vi.fn().mockResolvedValue(''),
      }

      // Act & Assert
      await expect(checkForErrors(mockResponse)).rejects.toThrow('Empty response received')
    })

    it('should handle invalid JSON responses', async () => {
      // Arrange
      const mockResponse = {
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue('application/json'),
        },
        text: vi.fn().mockResolvedValue('{"invalid json":'),
      }

      // Act & Assert
      await expect(checkForErrors(mockResponse)).rejects.toThrow('Invalid JSON response')
    })
  })

  describe('getAllStations', () => {
    it('should fetch all stations successfully', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue('application/json'),
        },
        text: vi.fn().mockResolvedValue(JSON.stringify(mockStations)),
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
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
      })

      // Act & Assert
      try {
        await getAllStations()
        // Should not reach here
        expect(true).toBe(false)
      } catch (err) {
        const error = err as Error & { status?: number }
        expect(error.message).toBe('HTTP error! status: 500')
        expect(error.status).toBe(500)
      }
    })
  })

  describe('getStation', () => {
    it('should fetch station by id successfully', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue('application/json'),
        },
        text: vi.fn().mockResolvedValue(JSON.stringify(mockStation)),
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
        headers: {
          get: vi.fn().mockReturnValue('application/json'),
        },
        text: vi.fn().mockResolvedValue(JSON.stringify([mockStation])),
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
        headers: {
          get: vi.fn().mockReturnValue('application/json'),
        },
        text: vi.fn().mockResolvedValue('[]'),
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
        headers: {
          get: vi.fn().mockReturnValue('application/json'),
        },
        text: vi.fn().mockResolvedValue(JSON.stringify(mockBooking)),
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
