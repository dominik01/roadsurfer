import type { Station } from '@/types'

export const mockStations: Station[] = [
  {
    id: '2',
    name: 'Berlin',
    bookings: [
      {
        id: '1',
        startDate: '2025-04-10T10:00:00',
        endDate: '2025-04-12T18:00:00',
        pickupReturnStationId: '1',
        customerName: 'John Doe',
      },
      {
        id: '2',
        customerName: 'Jane Smith',
        startDate: '2025-04-11T09:00:00',
        endDate: '2025-04-13T17:00:00',
        pickupReturnStationId: '1',
      },
      {
        id: '3',
        customerName: 'Alice Johnson',
        startDate: '2025-04-14T08:00:00',
        endDate: '2025-04-15T19:00:00',
        pickupReturnStationId: '1',
      },
      {
        id: '4',
        customerName: 'Bob Williams',
        startDate: '2025-04-15T11:00:00',
        endDate: '2025-04-18T16:00:00',
        pickupReturnStationId: '1',
      },
      {
        id: '5',
        customerName: 'Carol Brown',
        startDate: '2025-04-17T10:30:00',
        endDate: '2025-04-19T15:30:00',
        pickupReturnStationId: '1',
      },
    ],
  },
  {
    id: '34',
    name: 'Frankfurt',
    bookings: [
      {
        id: '12',
        startDate: '2025-04-10T10:00:00',
        endDate: '2025-04-12T18:00:00',
        pickupReturnStationId: '2',
        customerName: 'John Doe',
      },
      {
        id: '13',
        customerName: 'Jane Smith',
        startDate: '2025-04-11T09:00:00',
        endDate: '2025-04-13T17:00:00',
        pickupReturnStationId: '2',
      },
      {
        id: '14',
        customerName: 'Alice Johnson',
        startDate: '2025-04-14T08:00:00',
        endDate: '2025-04-15T19:00:00',
        pickupReturnStationId: '2',
      },
      {
        id: '15',
        customerName: 'Bob Williams',
        startDate: '2025-04-15T11:00:00',
        endDate: '2025-04-18T16:00:00',
        pickupReturnStationId: '2',
      },
      {
        id: '16',
        customerName: 'Carol Brown',
        startDate: '2025-04-17T10:30:00',
        endDate: '2025-04-19T15:30:00',
        pickupReturnStationId: '2',
      },
    ],
  },
]
