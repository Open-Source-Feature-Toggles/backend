

function ProtectedRequest (accessToken) {
    return fetch("http://localhost:3000/auth/test", {
        method : 'POST', 
        headers : { 'Authorization' : `Bearer ${accessToken}` }
    })
}

export { ProtectedRequest }