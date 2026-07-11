import React from 'react'
import ReactDOM from 'react-dom/client'
import BodyViewer from './BodyViewer'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0a',
    }}>
      <BodyViewer />
    </div>
  </React.StrictMode>
)
