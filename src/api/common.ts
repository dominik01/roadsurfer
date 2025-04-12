const BASE_URL = 'https://605c94c36d85de00170da8b4.mockapi.io/'

export const getStations = async () => {
  const response = await fetch(`${BASE_URL}/stations`)
  return await checkForErrors(response)
}

const checkForErrors = async (response) => {
  let responseData
  try {
    responseData = await response.json()
  } catch (e) {
    //if there is no response, return empty object
    responseData = { data: {} }
    console.log(e)
  }
  // check for error response
  if (response.status >= 400) {
    const errorObj = responseData.error || responseData
    // get error message from body or default to response statusText
    const error = `${errorObj?.title}: ${errorObj?.detail}` || response.statusText
    return Promise.reject(error)
  }
  // return the data object from the result
  return responseData
}
