const App = require('./app')
const AppInstance = App()

AppInstance.listen(3000, () => {
    console.log('Application is listening on PORT 3000')
})