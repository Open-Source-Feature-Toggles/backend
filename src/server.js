const CreateApp = require('./app')
const app = CreateApp()

const PORT = process.env.PORT || 3000 

app.listen(PORT, () => {
    console.log(`Application is listening on PORT ${PORT}`)
})