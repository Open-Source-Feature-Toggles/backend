import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import styles from "../styles/new-feature.module.css"

function NewFeaturePage () {
    
    const featureNameRef = useRef()
    const featureKeyRef = useRef()
    const descriptionRef = useRef() 
    const initialVariableKeyRef = useRef()
    const navigate = useNavigate()

    const createNewFeature = async function (e) {
        e.preventDefault()
        let request = await fetch( "http://localhost:3000/make-new-feature", {
            method : 'POST', 
            headers : { 'Content-Type' : 'application/json'}, 
            body : JSON.stringify({
                featureName : featureNameRef.current.value, 
                featureKey : featureKeyRef.current.value, 
                description : descriptionRef.current.value, 
                initialVariableKey : initialVariableKeyRef.current.value,
            })
        })
        if (!request.ok){ alert("Request Failed") ; return }
        navigate('/manage-variables')
    }


    return (
        <form id={styles.form} onSubmit={createNewFeature}>
            <h3>Create a Feature</h3>
            <div className={styles.form_cell_upper}>
                <div className={styles.form_cell_lower}>
                    <label htmlFor="feature-name">Feature Name</label>
                    <input required className={styles.form_cell_lower_input} id="feature-name" ref={featureNameRef} onChange={() => {featureKeyRef.current.value = featureNameRef.current.value}}/>
                </div>
                <div className={styles.form_cell_lower}>
                    <label htmlFor="feature-key">Feature Key</label>
                    <input required className={styles.form_cell_lower_input} id="feature-key" ref={featureKeyRef}/>
                </div>
            </div>
            <div className={styles.form_cell_textArea}>
                <label htmlFor="description">Description</label>
                <textarea ref={descriptionRef} id={styles.description} placeholder="Describe the feature here"></textarea>
            </div>
            <div className={styles.form_cell_variable_key}>
                <label htmlFor="initial-variable-name">Initial Variable Key</label>
                <input required type="text" ref={initialVariableKeyRef} id="initial-variable-name"/>
            </div>  
            <button className={styles.button} type="submit">Create Feature</button>
        </form>
    )
}

export default NewFeaturePage