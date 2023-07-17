import React from "react"
import { createRoot } from 'react-dom/client';
import App from "./components/App"
import { DataProvider } from "./contexts/DataContext"
import { AuthProvider } from "./contexts/AuthContext"

if (process.env.NODE_ENV === 'production') {
  console.log = () => {}
  console.error = () => {}
  console.debug = () => {}
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <AuthProvider>
    <DataProvider>
    <App />
    </DataProvider>
    </AuthProvider>
  </React.StrictMode>
)
