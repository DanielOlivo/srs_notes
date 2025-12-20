import { Decorator } from "@storybook/react-vite";
import { getStore, getStoreWithState, StoreState } from "../src/app/store";
import { Provider } from "react-redux";

export const withRedux: Decorator = (Story, context) => {
      const { redux, styles } = context.parameters 

      const store = redux ? getStoreWithState(redux as StoreState) : getStore()
      const _styles = styles as React.CSSProperties ?? {}

      return (
        <Provider store={store}>
          <div style={{
            ..._styles,
            width: _styles.width ?? "50vh",
            height: _styles.height ?? "50vh",
          }}>
            <Story />

          </div>
        </Provider>
      )
}