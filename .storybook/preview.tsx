import type { Preview } from '@storybook/react-vite'
// import { Provider } from "react-redux"
// import { getStore, getStoreWithState, StoreState } from "../src/app/store"
import "../src/index.css"
import { withRedux } from './withRedux';
import { withRouter } from "storybook-addon-remix-react-router"

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
  decorators: [
    withRedux,
    withRouter
  ]
};

export default preview;