import { useEffect, useState, useContext } from "react"
import { userContext } from "../contexts/user"
import { useNavigate } from "react-router-dom"
import loading_gif from "../assets/1476.gif"
import styles from "../public/test.module.css"

export default function Test () {

    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState()
    const navigate = useNavigate()
    const { user, setUser } = useContext(userContext)

    useEffect( () => {
        async function startup () {
            let request = await fetch("http://localhost:3000/auth/start-app", {
                method : 'POST' ,
                credentials: 'include' 
            })
            let response 
            if (!request.ok) { 
                response = await request.json()
                if (response.errors === 'Bad-Token'){
                    navigate("/login")
                }
            }
            response = await request.json()
            if (response.accessToken) {
                console.log(response.accessToken)
                setUser(response.accessToken)
                navigate("/success")
            }
        }
        startup()
    }, [])

    return (
        <div className={styles.main}>
            { loading ? 
                <img alt="nice" src={loading_gif} /> 
                :
                <div>{message}</div>
            }  
        </div>
    )
    
}



/* 
async function getCookie () {
        let request = await fetch("http://localhost:3000/auth/login", {
            method : 'POST', 
            credentials: 'include' 
        })
        if (!request.ok) { alert("Failed") ; return }
        console.log(request.headers)
        let data = await request.json()
        console.log(data)
        console.log(document.cookie)
    }

    async function sendCookie() {
        let request = await fetch("http://localhost:3000/hello/world", {
            method : 'POST', 
            credentials : 'include', 
        })
        if (!request.ok){ alert("Request failed") ; return }
        console.log("worked")
    }


    return (
        <div>
            <button onClick={getCookie}>GET INFORMATION</button>
            <button onClick={sendCookie}>SEND INFORMATION</button>
        </div>
    )
*/ 