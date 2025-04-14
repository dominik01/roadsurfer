import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import AutocompleteSearch from '@/components/AutocompleteSearch.vue'

describe('AutocompleteSearch.vue', () => {
  // Mock search function
  const mockSearchFn = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset the debounce timing
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const createWrapper = (props = {}) => {
    return mount(AutocompleteSearch, {
      props: {
        searchFn: mockSearchFn,
        placeholder: 'Search test...',
        ...props,
      },
    })
  }

  it('renders with the correct placeholder', () => {
    const wrapper = createWrapper({ placeholder: 'Custom placeholder' })

    expect(wrapper.find('input').attributes('placeholder')).toBe('Custom placeholder')
  })

  it('calls searchFn when user types', async () => {
    const wrapper = createWrapper()

    // Set the input value
    await wrapper.find('input').setValue('test')

    // Since we use debounce, we need to advance timers
    vi.advanceTimersByTime(300) // Greater than the 200ms debounce

    await flushPromises()

    expect(mockSearchFn).toHaveBeenCalledWith('test')
  })

  it('does not call searchFn for empty query', async () => {
    const wrapper = createWrapper()

    // Set empty input value
    await wrapper.find('input').setValue('')

    vi.advanceTimersByTime(300)
    await flushPromises()

    expect(mockSearchFn).not.toHaveBeenCalled()
  })

  it('displays loading indicator while searching', async () => {
    // Mock that takes some time to resolve
    mockSearchFn.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 500)),
    )

    const wrapper = createWrapper()

    // Set the input value
    await wrapper.find('input').setValue('test')

    // Advance past debounce time but before search completes
    vi.advanceTimersByTime(300)
    await flushPromises()

    // Loading indicator should be visible
    expect(wrapper.find('.loading-spinner').exists()).toBe(true)

    // Complete the search
    vi.advanceTimersByTime(500)
    await flushPromises()

    // Loading indicator should be gone
    expect(wrapper.find('.loading-spinner').exists()).toBe(false)
  })

  it('displays suggestions when results are received', async () => {
    const results = [
      { id: '1', name: 'Test Item 1' },
      { id: '2', name: 'Test Item 2' },
    ]

    mockSearchFn.mockResolvedValue(results)

    const wrapper = createWrapper()

    // Set the input value
    await wrapper.find('input').setValue('test')

    // Advance timers and wait for promises
    vi.advanceTimersByTime(300)
    await flushPromises()

    // Check that suggestions are displayed
    const suggestionItems = wrapper.findAll('li')
    expect(suggestionItems.length).toBe(2)
    expect(suggestionItems[0].text()).toBe('Test Item 1')
    expect(suggestionItems[1].text()).toBe('Test Item 2')
  })

  it('emits select event when a suggestion is clicked', async () => {
    const results = [
      { id: '1', name: 'Test Item 1' },
      { id: '2', name: 'Test Item 2' },
    ]

    mockSearchFn.mockResolvedValue(results)

    const wrapper = createWrapper()

    // Set the input value
    await wrapper.find('input').setValue('test')

    // Advance timers and wait for promises
    vi.advanceTimersByTime(300)
    await flushPromises()

    // Click the first suggestion
    await wrapper.findAll('li')[0].trigger('click')

    // Check that select event is emitted with correct item
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')[0][0]).toEqual(results[0])

    // Input should be updated with selected item's name
    expect(wrapper.find('input').element.value).toBe('Test Item 1')
  })

  it('displays "No results found" when search returns empty array', async () => {
    mockSearchFn.mockResolvedValue([])

    const wrapper = createWrapper()

    // Set the input value
    await wrapper.find('input').setValue('test')

    // Advance timers and wait for promises
    vi.advanceTimersByTime(300)
    await flushPromises()

    // Check for "No results" message
    const noResults = wrapper.find('li.text-neutral-content')
    expect(noResults.exists()).toBe(true)
    expect(noResults.text()).toBe('No results found')
  })

  it('displays error message when search fails', async () => {
    mockSearchFn.mockRejectedValue(new Error('Search failed'))

    const wrapper = createWrapper()

    // Set the input value
    await wrapper.find('input').setValue('test')

    // Advance timers and wait for promises
    vi.advanceTimersByTime(300)
    await flushPromises()

    // Check for error message
    const errorMsg = wrapper.find('li.text-error')
    expect(errorMsg.exists()).toBe(true)
    expect(errorMsg.text()).toContain('Something went wrong')
  })

  it('handles 404 errors with "No results found" message', async () => {
    const error = new Error('Not found')
    error.message = '404 Not found'
    mockSearchFn.mockRejectedValue(error)

    const wrapper = createWrapper()

    // Set the input value
    await wrapper.find('input').setValue('test')

    // Advance timers and wait for promises
    vi.advanceTimersByTime(300)
    await flushPromises()

    // Check for No results message instead of error
    const errorMsg = wrapper.find('li.text-error')
    expect(errorMsg.exists()).toBe(true)
    expect(errorMsg.text()).toBe('No results found')
  })

  it('uses custom format function when provided', async () => {
    const results = [
      { id: '1', title: 'Test Item 1' },
      { id: '2', title: 'Test Item 2' },
    ]

    mockSearchFn.mockResolvedValue(results)

    const formatFn = (item) => item.title.toUpperCase()
    const wrapper = createWrapper({ format: formatFn })

    // Set the input value
    await wrapper.find('input').setValue('test')

    // Advance timers and wait for promises
    vi.advanceTimersByTime(300)
    await flushPromises()

    // Check that custom format is used for display
    const suggestionItems = wrapper.findAll('li')
    expect(suggestionItems[0].text()).toBe('TEST ITEM 1')

    // Click item and check input is updated with formatted value
    await suggestionItems[0].trigger('click')
    expect(wrapper.find('input').element.value).toBe('TEST ITEM 1')
  })

  it('clears suggestions when input is emptied', async () => {
    const results = [{ id: '1', name: 'Test Item' }]
    mockSearchFn.mockResolvedValue(results)

    const wrapper = createWrapper()

    // Set input value to trigger search
    await wrapper.find('input').setValue('test')
    vi.advanceTimersByTime(300)
    await flushPromises()

    // Verify suggestions are shown
    expect(wrapper.find('ul').exists()).toBe(true)

    // Clear input
    await wrapper.find('input').setValue('')
    vi.advanceTimersByTime(300)
    await flushPromises()

    // Verify suggestions are hidden
    expect(wrapper.find('ul').exists()).toBe(false)
  })

  it('handles non-array responses gracefully', async () => {
    // Mock an invalid response (not an array)
    mockSearchFn.mockResolvedValue({ invalid: 'response' })

    const wrapper = createWrapper()

    // Set the input value
    await wrapper.find('input').setValue('test')

    // Advance timers and wait for promises
    vi.advanceTimersByTime(300)
    await flushPromises()

    // Should show error message for invalid response format
    const errorMsg = wrapper.find('li.text-error')
    expect(errorMsg.exists()).toBe(true)
    expect(errorMsg.text()).toContain('Invalid response format')
  })
})
