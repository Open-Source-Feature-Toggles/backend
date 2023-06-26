import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { checkForRefresh } from "./network-requests/check-for-refresh";
import Login from "./components/Login";
import Success from "./components/Success";
import UserProtectedRoute from "./components/user-protected-route";
import { useState, useMemo, useEffect } from "react";
import { userContext } from "../../one/src/contexts/user";
import loadingGif from "./assets/loading.gif"

export default function Router () {
    
    const [token, setToken] = useState()
    const [loading, setLoading] = useState(true)
    const tokenValue = useMemo(() => ({ token, setToken }), [token, setToken]);


    useEffect( () => {
        async function wrapper () {
            let request = await checkForRefresh() 
            if (!request.ok){
                console.log("no key found")
                setLoading(false)
                return
            }
            let { accessToken } = await request.json()
            setToken(accessToken)
            setLoading(false)
        }
        wrapper()
    }, [])

    
    return (
        <>
            { loading ?  
                <img src={loadingGif} alt="ye-ole-loading"/> 
                : 
                <BrowserRouter>
                    <userContext.Provider value={tokenValue}>
                        <Routes>
                            <Route exact path="/" element={ !token ? <Login/> : <Navigate to="/successful-login"/>}/>
                            <Route exact path="/successful-login" element={ token ? <Success/> : <Navigate to="/"/>}/>
                            <Route exact path="/user-protected-route" element={ token ? <UserProtectedRoute/> : <Navigate to="/"/>}/>
                        </Routes>
                    </userContext.Provider>
                </BrowserRouter>
            } 
        </>   
    )
}

