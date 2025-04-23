<template>
  <div class="relative w-full">
    <input
      type="text"
      v-model="query"
      @input="onInput"
      :placeholder="placeholder"
      class="input w-full pr-10 bg-white"
    />

    <!-- Spinner -->
    <div v-if="isLoading" class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
      <span class="loading loading-spinner loading-sm text-neutral" />
    </div>

    <!-- Suggestions Dropdown -->
    <ul
      v-if="(suggestions.length || noResults || errorMessage) && showSuggestions"
      class="absolute z-10 mt-1 w-full bg-base-100 border border-base-300 rounded-box shadow-md"
    >
      <!-- Suggestions List -->
      <li
        v-for="(item, index) in suggestions"
        :key="index"
        @click="select(item)"
        class="px-4 py-2 hover:bg-base-200 cursor-pointer"
      >
        {{ formatItem(item) }}
      </li>

      <!-- No Results -->
      <li v-if="noResults && !isLoading" class="px-4 py-2 text-sm text-neutral-content italic">
        No results found
      </li>

      <!-- Error -->
      <li v-if="errorMessage && !isLoading" class="px-4 py-2 text-sm text-error italic">
        {{ errorMessage }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import debounce from 'lodash/debounce'

interface Props<T> {
  placeholder?: string
  searchFn: (query: string) => Promise<T[]>
  format?: (item: T) => string
}

const props = withDefaults(defineProps<Props<any>>(), {
  placeholder: 'Search...',
  format: (item: any) => item?.name || item,
})

const emit = defineEmits<{
  (e: 'select', value: any): void
}>()

const query = ref('')
const suggestions = ref<any[]>([])
const showSuggestions = ref(false)
const isLoading = ref(false)
const noResults = ref(false)
const errorMessage = ref('')

const fetchSuggestions = debounce(async (text: string) => {
  suggestions.value = []
  noResults.value = false
  errorMessage.value = ''
  showSuggestions.value = false

  if (!text) return
  isLoading.value = true

  try {
    const results = await props.searchFn(text)

    suggestions.value = results
    noResults.value = results.length === 0
    showSuggestions.value = true
  } catch (err: any) {
    errorMessage.value = err.message.includes('404')
      ? 'No results found'
      : 'Something went wrong. Please try again.'
    showSuggestions.value = true
  } finally {
    isLoading.value = false
  }
}, 200)

const onInput = () => {
  fetchSuggestions(query.value)
}

const select = (item: any) => {
  emit('select', item)
  query.value = props.format(item)
  suggestions.value = []
  showSuggestions.value = false
  query.value = ''
}

const formatItem = (item: any): string => {
  return props.format(item)
}
</script>
