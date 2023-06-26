


/* 

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

*/ 