import { createContext } from 'react'
const initialState = {
  namespace: 'default',
  version: 'latest',
}
export const PolicyContext = createContext(initialState)

export const PolicyContextProvider = PolicyContext.Provider

export const PolicyContextConsumer = PolicyContext.Consumer
