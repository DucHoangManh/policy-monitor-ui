import Dashboard from './Dashboard'
import { PolicyContextProvider } from './Context/policyContext'
import './App.css'
import { useState } from 'react'

function App() {
  const initialState = {
    currentNamespace: 'default',
    currentVersion: 'latest',
    allowUpdate: 'true',
  }
  const [context, setContext] = useState(initialState)
  return (
    <PolicyContextProvider value={[context, setContext]}>
      <Dashboard />
    </PolicyContextProvider>
  )
}

export default App
