import React, {useEffect} from 'react'
import AppRoutes from './routes/AppRoutes'
import { UserProvider } from './context/user.context'
import hljs from 'highlight.js'
import 'highlight.js/styles/nord.css'

function App() {
  useEffect(() => {
    // Highlight all code blocks after the component mounts
    hljs.highlightAll();
  }, []);
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  )
}

export default App
