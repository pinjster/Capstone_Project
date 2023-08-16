import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import UserProvider from './contexts/UserProvider.tsx'
import MediaProvider from './contexts/MediaProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <MediaProvider>
        <App />
      </MediaProvider>
    </UserProvider>
  </React.StrictMode>,
)
