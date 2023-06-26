const { sign, verify } = require('jsonwebtoken')
const ACCESS_SECRET = process.env.ACCESS_SECRET
const REFRESH_SECRET = process.env.REFRESH_SECRET

function generateAccessToken (payload) {
    return sign({ user : payload }, ACCESS_SECRET, { 'expiresIn' : '15m' })
}

function generateRefreshToken (payload) {
    return sign({ user: payload }, REFRESH_SECRET, { 'expiresIn' : '7d' })
}

function getAccessToken(req) {
    let authHeader = req.headers['authorization']
    return authHeader && authHeader.split(" ")[1]
}

function getRefreshToken(req) {
    return req.cookies && req.cookies.rjid
}

async function verifyToken (token, secret) {
    return new Promise(( resolve, reject ) => {
        verify(token, secret, (err, payload) => {
            if (err) { reject(err) }
            else { resolve(payload) }
        })
    })
}


module.exports = {
    generateAccessToken, 
    generateRefreshToken, 
    getAccessToken, 
    getRefreshToken, 
    verifyToken, 
}