// src/components/__tests__/AutocompleteSearch.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import AutocompleteSearch from '../AutocompleteSearch.vue'

// Mock the debounce function to execute immediately
vi.mock('lodash', () => ({
  default: { debounce: (fn) => fn },
  debounce: (fn) => fn,
}))

describe('AutocompleteSearch', () => {
  const mockSearchFn = vi.fn()

  function createWrapper(props = {}) {
    return mount(AutocompleteSearch, {
      props: {
        searchFn: mockSearchFn,
        ...props,
      },
    })
  }

  it('renders properly with default props', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('input').attributes('placeholder')).toBe('Search...')
  })

  it('renders with custom placeholder', () => {
    const wrapper = createWrapper({ placeholder: 'Custom placeholder' })
    expect(wrapper.find('input').attributes('placeholder')).toBe('Custom placeholder')
  })

  it('shows loading state when searching', async () => {
    // Create a promise we can control
    let resolve
    const promise = new Promise((r) => {
      resolve = r
    })
    mockSearchFn.mockReturnValue(promise)

    const wrapper = createWrapper()
    await wrapper.find('input').setValue('test')
    await wrapper.find('input').trigger('input')

    // Should show spinner during loading
    expect(wrapper.find('.loading-spinner').exists()).toBe(true)

    // Resolve the promise to clean up
    resolve([])
    await flushPromises()
  })

  it('calls search function when typing', async () => {
    mockSearchFn.mockResolvedValue([])
    const wrapper = createWrapper()

    await wrapper.find('input').setValue('test')
    await wrapper.find('input').trigger('input')
    await flushPromises()

    expect(mockSearchFn).toHaveBeenCalledWith('test')
  })

  it('emits select event when item is selected', async () => {
    const item = { id: 1, name: 'Test Item' }
    const wrapper = createWrapper()

    // Call the select method directly
    wrapper.vm.select(item)

    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')[0][0]).toEqual(item)
  })

  it('formats items using provided format function', () => {
    const customFormat = (item) => `Custom: ${item.name}`
    const wrapper = createWrapper({ format: customFormat })

    const item = { id: 1, name: 'Test Item' }
    expect(wrapper.vm.formatItem(item)).toBe('Custom: Test Item')
  })
})
