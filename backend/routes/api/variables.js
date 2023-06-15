const express = require('express')
const router = express.Router() 
const variable_controller = require('../../controllers/api/variable-controller')

router.post("/make-new-variable", variable_controller.POST_make_new_variable)

module.exports = router