import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'
import { BrowserRouter, RouterProvider } from 'react-router'
import { someRouter } from './router.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      {/* <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter> */}
      <RouterProvider  router={someRouter} />
    </Provider>
  </StrictMode>,
)
