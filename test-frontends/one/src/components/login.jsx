import { useRef, useContext, useEffect } from "react"
import styles from '../public/login.module.css'
import { useNavigate } from "react-router-dom"
import { userContext } from "../contexts/user"


export default function Login () {

    const usernameRef = useRef()
    const passwordRef = useRef() 
    const navigate = useNavigate()

    const {user, setUser} = useContext(userContext)


    async function submitLogin (e) {
        e.preventDefault()
        let payload = {
            username : usernameRef.current.value, 
            password : passwordRef.current.value, 
        }
        let request = await fetch("http://localhost:3000/auth/login", {
            method : 'POST', 
            credentials : 'include', 
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify(payload)
        })
        if (!request.ok){
            alert( "failed" ) 
            return 
        }
        navigate("/success")



    }

    useEffect( () => {
        console.log(user)
    }, [user])

    return (
        <div>
            <form onSubmit={submitLogin}>
                <div className={styles.form_cell}>
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" ref={usernameRef} />
                </div>
                <div className={styles.form_cell}>
                    <label htmlFor="password">Password</label>
                    <input type="text" id="password" ref={passwordRef} />
                </div>
                <div className={styles.center_btn}>
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    )
}