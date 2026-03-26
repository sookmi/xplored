import type { Preview } from '@storybook/nextjs-vite'
import React from 'react'
import { ThemeProvider } from 'next-themes'
import '../lib/tokens.css'
import '../app/globals.css'

const preview: Preview = {
  decorators: [
    (Story) => React.createElement(
      ThemeProvider,
      { attribute: 'class', defaultTheme: 'light', enableSystem: false },
      React.createElement(Story)
    ),
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },
    options: {
      storySort: {
        order: ['Foundation', ['Color', 'Typography', 'Spacing', 'Radius', 'Effect'], 'Design System'],
      },
    },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo'
    }
  },
};

export default preview;
