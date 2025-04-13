const BASE_URL = 'https://605c94c36d85de00170da8b4.mockapi.io/'

export const getStations = async () => {
  const response = await fetch(`${BASE_URL}/stations`)

  return await checkForErrors(response)
}

export const searchStation = async (text: string): Promise<Station[]> => {
  const response = await fetch(`${BASE_URL}/stations?name=${text}`)

  return await checkForErrors(response)
}

const checkForErrors = async (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}
