import type { Preview } from '@storybook/react-vite'
import '../src/index.css'

const preview: Preview = {
  decorators: [
    (Story) => (
      <div
        className="bg-[#F9FBFF] min-h-[100px] p-6"
        style={{
          // Design system tokens — override :root to match /design-system
          '--primary': '#0052FF',
          '--primary-foreground': '#ffffff',
          '--cta': '#0052FF',
          '--cta-foreground': '#ffffff',
          '--heading': '#0f172a',
          '--body-muted': '#64748b',
          '--surface-tint': '#EEF3FF',
          '--surface-subtle': '#F9FBFF',
        } as React.CSSProperties}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
}

export default preview
