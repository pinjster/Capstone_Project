import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import UserProvider from './contexts/UserProvider.tsx'
import MediaProvider from './contexts/MediaProvider.tsx'
import RmendProvider from './contexts/RmendProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <RmendProvider>
        <MediaProvider>
          <App />
        </MediaProvider>
      </RmendProvider>
    </UserProvider>
  </React.StrictMode>,
)
