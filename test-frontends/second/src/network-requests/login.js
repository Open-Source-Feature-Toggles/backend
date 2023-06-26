
function callBackendLogin (username, password) {
    return fetch("http://localhost:3000/auth/login", {
        method: 'POST', 
        credentials : 'include', 
        headers : { 
            'Content-Type' : 'application/json' 
        },
        body : JSON.stringify({
            username, 
            password, 
        })
    })
}

export { callBackendLogin }