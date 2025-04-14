// This file will be loaded automatically by Vitest for test setup

// Silence Vue logs during tests
import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Suppress Vue warnings
config.global.config.warnHandler = () => null

// Mock console methods to avoid cluttering the test output
vi.spyOn(console, 'error').mockImplementation(() => {})
vi.spyOn(console, 'warn').mockImplementation(() => {})

// Add any global mocks or setup here
