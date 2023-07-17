const CreateApp = require('./app')
const app = CreateApp()

app.listen(3000, () => {
    console.log('Application is listening on PORT 3000')
})