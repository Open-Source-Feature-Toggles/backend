import { useState, useRef } from 'react'
import Switch from "react-switch"
import './App.css'

function App() {

    const [checked, setChecked] = useState(true)
    const featureName = useRef()
    const expirationDate = useRef() 

    const make_feature_flag = async function(e) {
        e.preventDefault() 
        let payload = {
            'name' : featureName.current.value, 
            'expiration_date' : expirationDate.current.value, 
            'active' : checked,  
        }
        let make_request= await fetch( 'http://localhost:3000/make-feature', {
            method  : 'POST', 
            headers : {
                'Content-Type' : 'application/json'
            }, 
            body : JSON.stringify(payload)
        })
        if (!make_request.ok){
            alert("request failed")
        }
        else {
            setChecked(true) 
            featureName.current.value = ''
            expirationDate.current.value = ''
        }
    }
 
    const changeSwitchValue = function () {
        setChecked(!checked) 
    }

    return (
        <>
        <form onSubmit={make_feature_flag}>
                <div className='form-cell'>
                    <label htmlFor="name">Name of Feature </label>
                    <input type="text" id='name' name='name' ref={featureName} />
                </div>
                <div className='form-cell'>
                    <label htmlFor="expiration-date">Expiration Date (default expiration is 30 days from current date and time) </label>
                    <input type="datetime-local" id='expiration-date' name='expiration-date' ref={expirationDate} />
                </div>
                <div className='form-cell'>
                    <div className='form-cell'>
                        Activate Feature? 
                        <Switch 
                        checked={checked}
                        onChange={changeSwitchValue}
                        />
                    </div>
                </div>
                <button className='make-new-feature-button'>Make Feature</button>
        </form>
        </>
    )
}

export default App
