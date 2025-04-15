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

const checkForErrors = async (response) => {
  // Handle HTTP errors
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`

    // Try to add more context from the response if possible
    try {
      const errorBody = await response.text()
      const errorJson = JSON.parse(errorBody)
      if (errorJson.message || errorJson.error) {
        errorMessage += `: ${errorJson.message || errorJson.error}`
      }
    } catch {
      // Ignore parsing errors - we'll use the basic error message
    }

    const error = new Error(errorMessage)
    error.status = response.status
    throw error
  }

  // Check content type
  const contentType = response.headers.get('content-type')
  if (contentType && !contentType.includes('application/json')) {
    throw new Error('Response is not JSON')
  }

  // Parse JSON response
  const text = await response.text()

  // Handle empty responses
  if (!text) {
    throw new Error('Empty response received')
  }

  try {
    return JSON.parse(text)
  } catch (error) {
    throw new Error(`Failed to parse JSON response: ${error.message}`)
  }
}
