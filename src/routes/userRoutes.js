const express = require('express');
const { register } = require('../controllers/userController'); //load fun from z controllerfile

const router = express.Router(); // create route instance

router.post('/users', register); //Define a POST route

module.exports = router;
