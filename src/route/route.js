const express = require('express');
const router = express.Router();
const collegeController=require("../controller/collegeController")
const internController = require("../controller/internController")

//To register college
router.post("/functionup/colleges",collegeController.createCollege)

//To register as a intern
router.post('/functionup/interns',internController.createIntern)

//to get insternlist with the associted college
router.get('/functionup/collegeDetails',collegeController.collegeDetails)









module.exports = router;