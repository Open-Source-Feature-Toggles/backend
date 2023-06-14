import { useState, useRef } from "react";
import styles from "../styles/new-project.module.css"

function Projects(){
    
    const projectNameInput = useRef()


    const makeProject = async function (e) {
        e.preventDefault()
        let name = projectNameInput.current.value 
        if (name.trim() === ''){ return }
        let data = { 
            name, 
            features : [], 
        }
        let post_request = await fetch("http://localhost:3000/")

    }


    return (
        <div>
            <form className={styles.form} onSubmit={makeProject}>
                <div className={styles.form_cell}>
                    <label htmlFor="project-name">Project Name </label>
                    <input required type="text" ref={projectNameInput}  />
                </div>
                <button className={styles.btn}>Make Project</button>
            </form>
        </div>
    )
}

export default Projects