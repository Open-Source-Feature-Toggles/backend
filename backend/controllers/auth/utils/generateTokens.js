const { sign } = require('jsonwebtoken')
const ACCESS_SECRET = process.env.ACCESS_SECRET
const REFRESH_SECRET = process.env.REFRESH_SECRET

function generateAccessToken (payload) {
    return sign({ user : payload }, ACCESS_SECRET, { 'expiresIn' : '15m' })
}

function generateRefreshToken (payload) {
    return sign({ user: payload }, REFRESH_SECRET, { 'expiresIn' : '7d' })
}

module.exports = {
    generateAccessToken, 
    generateRefreshToken
}