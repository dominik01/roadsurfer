import type { Booking, Station } from '@/types'

const BASE_URL = 'https://605c94c36d85de00170da8b4.mockapi.io'

export const getAllStations = async (): Promise<Station[]> => {
  const response = await fetch(`${BASE_URL}/stations`)

  return await checkForErrors(response)
}

export const getStation = async (stationId: string): Promise<Station> => {
  const response = await fetch(`${BASE_URL}/stations/${stationId}`)

  return await checkForErrors(response)
}

export const searchStation = async (query: string): Promise<Station[]> => {
  const response = await fetch(`${BASE_URL}/stations?name=${query}`)

  return await checkForErrors(response)
}

export const getBooking = async (stationId: string, bookingId: string): Promise<Booking> => {
  const response = await fetch(`${BASE_URL}/stations/${stationId}/bookings/${bookingId}`)

  return await checkForErrors(response)
}

export const checkForErrors = async (response: Response): Promise<any> => {
  // Handle HTTP errors
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`
    let errorData

    try {
      // Attempt to extract additional error context
      errorData = await response.json()
      if (errorData.message || errorData.error) {
        errorMessage += `: ${errorData.message || errorData.error}`
      }
    } catch {
      // JSON parsing failed, continue with basic error
    }

    const error = new Error(errorMessage) as Error & { status: number; data?: any }
    error.status = response.status
    error.data = errorData
    throw error
  }

  // Validate JSON content type
  const contentType = response.headers.get('content-type')
  if (contentType && !contentType.includes('application/json')) {
    throw new Error('Response is not JSON')
  }

  // Handle response content
  const text = await response.text()
  if (!text) {
    throw new Error('Empty response received')
  }

  // Parse and return the JSON
  try {
    return JSON.parse(text)
  } catch (error) {
    throw new Error(`Invalid JSON response: ${(error as Error).message}`)
  }
}
