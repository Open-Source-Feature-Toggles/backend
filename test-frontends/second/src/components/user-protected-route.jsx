import { useEffect, useState, useContext } from "react"
import niture from "../assets/niture.gif"
import { ProtectedRequest } from "../network-requests/user-protected-route"
import { userContext } from "../../../one/src/contexts/user"

export default function UserProtectedRoute () {

    const [message, setMessage] = useState()
    const { token, setToken } = useContext(userContext)

    useEffect( () => {
        if (token) {
            async function wrapper (accessToken) {
                let request = await ProtectedRequest(accessToken)
                if (!request.ok){
                    alert("Bad request") ; 
                    return
                }
                let data = await request.json()
                setMessage(data.message)
            }
            wrapper(token)
        }
    }, [token])



    return (
        <div>
            <h1>This is a user protected route</h1>
            <img src={niture} alt="niture"/>
            { message ? <h1>{message}</h1> : <h1>No message</h1> } 
        </div>
    )
}

