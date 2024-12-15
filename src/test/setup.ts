import '@testing-library/jest-dom'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import { QueryClient } from '@tanstack/react-query'

// Automatically cleanup after each test
afterEach(() => {
  cleanup()
})

// Global test utilities
export const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})