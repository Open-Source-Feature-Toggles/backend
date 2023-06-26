import styles from "../styles/login.module.css"
import { useRef, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { callBackendLogin } from "../network-requests/login"
import { userContext } from "../../../one/src/contexts/user"

export default function Login () {

    const usernameRef = useRef()
    const passwordRef = useRef()
    const navigate = useNavigate()
    const { token, setToken } = useContext(userContext)

    const submitLogin = async (e) => {
        e.preventDefault()
        let request = await callBackendLogin(usernameRef.current.value, passwordRef.current.value)
        if (!request.ok){
            alert("Request failed") ; 
            return 
        }
        let {accessToken} = await request.json() 
        setToken(accessToken)
        navigate("/successful-login")
    }

    return (
        <form onSubmit={submitLogin}>
            <div className={styles.form_cell}>
                <label htmlFor="username">Username </label>
                <input type="text" id="username" ref={usernameRef} />
            </div>
            <div className={styles.form_cell}>
                <label htmlFor="password">Password </label>
                <input type="text" id="password" ref={passwordRef} />
            </div>
            <button type="submit">Login</button>
        </form>
    )
}