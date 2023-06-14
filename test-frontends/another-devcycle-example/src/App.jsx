import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { withDVCProvider, useDVCClient } from '@devcycle/devcycle-react-sdk'
import hello from "./hankus/hello"
import Frame from './components/frame'

function App() {
  const newUser = {
    user_id : "Hank", 
  }
  const dvcClient = useDVCClient()
  dvcClient.identifyUser(newUser)
  
  hello()
  return (
    <>  
      <h1>Hi there</h1> 
      <Frame />
      <div className='rectangle'></div>
    </>
  )
}

export default withDVCProvider({ sdkKey : import.meta.env.VITE_FRONTEND_SDK })(App) 
