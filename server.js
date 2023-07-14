const App = require('./app')
const dotenv = require('dotenv').config()
const AppInstance = App(process.env.CONNECTION_STRING)

AppInstance.listen(3000, () => {
    console.log('Application is listening on PORT 3000')
})