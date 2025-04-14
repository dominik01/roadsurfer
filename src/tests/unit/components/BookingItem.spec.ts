import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { format, parseISO } from 'date-fns'
import BookingItem from '@/components/BookingItem.vue'

describe('BookingItem.vue', () => {
  const booking = {
    id: '1',
    customerName: 'John Doe',
    startDate: '2025-04-15T10:00:00',
    endDate: '2025-04-17T18:00:00',
  }

  const currentDate = new Date('2025-04-15')

  const createWrapper = (isStart = true, isEnd = false) => {
    return mount(BookingItem, {
      props: {
        booking,
        currentDate,
        isStart,
        isEnd,
      },
    })
  }

  it('displays the customer name', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('.font-medium').text()).toBe('John Doe')
  })

  it('displays start time when isStart is true', () => {
    const wrapper = createWrapper(true, false)

    const formattedTime = format(parseISO(booking.startDate), 'h:mm a')
    expect(wrapper.text()).toContain(`Start: ${formattedTime}`)
  })

  it('displays end time when isEnd is true', () => {
    const wrapper = createWrapper(false, true)

    const formattedTime = format(parseISO(booking.endDate), 'h:mm a')
    expect(wrapper.text()).toContain(`End: ${formattedTime}`)
  })

  it('displays both start and end times when both are true', () => {
    const wrapper = createWrapper(true, true)

    const startTime = format(parseISO(booking.startDate), 'h:mm a')
    const endTime = format(parseISO(booking.endDate), 'h:mm a')

    expect(wrapper.text()).toContain(`Start: ${startTime}`)
    expect(wrapper.text()).toContain(`End: ${endTime}`)
  })

  it('applies blue background class when only start date', () => {
    const wrapper = createWrapper(true, false)

    expect(wrapper.classes()).toContain('bg-blue-200')
    expect(wrapper.classes()).not.toContain('bg-green-200')
    expect(wrapper.classes()).not.toContain('bg-purple-200')
  })

  it('applies green background class when only end date', () => {
    const wrapper = createWrapper(false, true)

    expect(wrapper.classes()).toContain('bg-green-200')
    expect(wrapper.classes()).not.toContain('bg-blue-200')
    expect(wrapper.classes()).not.toContain('bg-purple-200')
  })

  it('applies purple background class when both start and end date', () => {
    const wrapper = createWrapper(true, true)

    expect(wrapper.classes()).toContain('bg-purple-200')
    expect(wrapper.classes()).not.toContain('bg-blue-200')
    expect(wrapper.classes()).not.toContain('bg-green-200')
  })

  it('emits click event with booking id when clicked', async () => {
    const wrapper = createWrapper()

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')[0]).toEqual(['1'])
  })
})
