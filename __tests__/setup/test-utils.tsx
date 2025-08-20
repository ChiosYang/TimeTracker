import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'

// Mock session for testing
const mockSession = {
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    image: null
  },
  expires: '2024-12-31T23:59:59.999Z'
}

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  session?: any
}

function customRender(
  ui: ReactElement,
  { session = mockSession, ...renderOptions }: CustomRenderOptions = {}
): ReturnType<typeof render> {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <SessionProvider session={session}>
        {children}
      </SessionProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Re-export everything
export * from '@testing-library/react'

// Override render method
export { customRender as render }

// Utility function to wait for async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0))