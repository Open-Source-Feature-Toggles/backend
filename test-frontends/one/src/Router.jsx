import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { userContext } from './contexts/user'
import Test from './components/test'
import Login from './components/login'
import SuccessfulLogin from './components/success'

function Router ( ) { 

    const [user, setUser] = useState()
    const userValue = useMemo(() => ({user, setUser}), [user, setUser])

    return (
        <BrowserRouter>
            <userContext.Provider value={userValue}>
                <Routes>
                        <Route exact path='/' element={<Test/>}/> 
                        <Route exact path="/login" element={ !user ? <Login/> : <Navigate to="/success"/>}/> 
                        <Route exact path="/success" element={user ? <SuccessfulLogin /> : <Navigate to="/login" />} /> 
                </Routes>
            </userContext.Provider> 
        </BrowserRouter>
    )

}

export default Router
