export interface Booking {
  id: string
  customerName: string
  startDate: string
  endDate: string
  pickupReturnStationId: string
}

export interface Station {
  id: string
  name: string
  bookings: Booking[]
}
