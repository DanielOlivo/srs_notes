import { type Decorator } from "@storybook/react-vite";
import { getStore, getStoreWithState, type StoreState } from "../src/app/store";
import { Provider } from "react-redux";
import { useIncrementTime } from "../src/List/hooks/incrTime"
import { setTime } from "../src/List/list.slice";

export const withRedux: Decorator = (Story, context) => {
      const { redux, /* styles */ } = context.parameters 

      const store = redux ? getStoreWithState(redux as StoreState) : getStore()
      // const _styles = styles as React.CSSProperties ?? {}

      if(redux.incrTime === true)
        setInterval(() => store.dispatch(setTime()), 1000)

      return (
        <Provider store={store}>
            <Story />
        </Provider>
      )
}