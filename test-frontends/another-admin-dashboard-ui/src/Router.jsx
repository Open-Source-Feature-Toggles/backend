import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import NewFeaturePage from './components/new-feature'
import ManageVariables from './components/variables'
import Projects from './components/projects'
import projectContext from './utils/project'
import { useEffect, useState, useMemo } from 'react'

export default function Router () {

    const [project, setProject] = useState("Test-Proj")
    const context = useMemo(() => ({ project, setProject }), [project]);

    useEffect( () => {

    }, [])

    return (
        <BrowserRouter>
            <projectContext.Provider value={context}>
                <Routes>
                    <Route exact path='/' element={<Projects/>}/>
                    <Route exact path='/new-features' element={<NewFeaturePage/>}/>
                    <Route exact path='/manage-variables' element={<ManageVariables/>} />
                </Routes>
            </projectContext.Provider>
        </BrowserRouter>
    )
}