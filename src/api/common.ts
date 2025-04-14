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

const checkForErrors = async (response: any) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}
