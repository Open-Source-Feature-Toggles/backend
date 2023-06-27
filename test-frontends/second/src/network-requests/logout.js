function Logout () {
    return fetch("http://localhost:3000/auth/logout", {
        method : 'DELETE', 
        credentials : 'include', 
    })
}


export default Logout