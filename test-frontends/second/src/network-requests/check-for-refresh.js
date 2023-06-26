
function checkForRefresh () {
    return fetch("http://localhost:3000/auth/start-app", {
        method : 'POST', 
        credentials : 'include', 
    })
}

export { checkForRefresh }