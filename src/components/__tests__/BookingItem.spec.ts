// src/components/__tests__/BookingItem.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BookingItem from '../BookingItem.vue'
import { format, parseISO } from 'date-fns'
import type { Booking } from '@/types'

describe('BookingItem', () => {
  const mockBooking: Booking = {
    id: '123',
    customerName: 'John Doe',
    startDate: '2023-01-01T10:00:00Z',
    endDate: '2023-01-03T15:00:00Z',
    pickupReturnStationId: '1',
  }

  const currentDate = new Date('2023-01-02')

  const mountComponent = (props: Partial<any> = {}) => {
    return mount(BookingItem, {
      props: {
        booking: mockBooking,
        currentDate: currentDate,
        isStart: false,
        isEnd: false,
        ...props,
      },
    })
  }

  it('renders customer name', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.font-medium').text()).toBe('John Doe')
  })

  it('applies blue background for start-only bookings', () => {
    const wrapper = mountComponent({ isStart: true, isEnd: false })
    expect(wrapper.classes()).toContain('bg-blue-200')
  })

  it('applies green background for end-only bookings', () => {
    const wrapper = mountComponent({ isStart: false, isEnd: true })
    expect(wrapper.classes()).toContain('bg-green-200')
  })

  it('applies purple background for same-day start/end bookings', () => {
    const wrapper = mountComponent({ isStart: true, isEnd: true })
    expect(wrapper.classes()).toContain('bg-purple-200')
  })

  it('shows start time when isStart is true', () => {
    const wrapper = mountComponent({ isStart: true })
    const expectedTime = format(parseISO(mockBooking.startDate), 'h:mm a')
    expect(wrapper.text()).toContain(`Start: ${expectedTime}`)
  })

  it('shows end time when isEnd is true', () => {
    const wrapper = mountComponent({ isEnd: true })
    const expectedTime = format(parseISO(mockBooking.endDate), 'h:mm a')
    expect(wrapper.text()).toContain(`End: ${expectedTime}`)
  })

  it('shows both start and end times when both are true', () => {
    const wrapper = mountComponent({ isStart: true, isEnd: true })
    const expectedStartTime = format(parseISO(mockBooking.startDate), 'h:mm a')
    const expectedEndTime = format(parseISO(mockBooking.endDate), 'h:mm a')

    expect(wrapper.text()).toContain(`Start: ${expectedStartTime}`)
    expect(wrapper.text()).toContain(`End: ${expectedEndTime}`)
  })

  it('emits click event with booking id when clicked', async () => {
    const wrapper = mountComponent()
    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')![0]).toEqual(['123'])
  })

  it('handles long customer names with truncation', () => {
    const longNameBooking = {
      ...mockBooking,
      customerName: 'This is a very long customer name that should be truncated in the UI',
    }

    const wrapper = mountComponent({ booking: longNameBooking })
    const nameElement = wrapper.find('.font-medium')

    expect(nameElement.classes()).toContain('truncate')
  })
})
