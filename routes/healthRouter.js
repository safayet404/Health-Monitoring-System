const express = require('express')
const { createHealthData, getHealthData, getSingleHealthData, updateHealthData, deleteHealthData } = require('../controller/healthController')

const router = express.Router()


router.post('/create-data',createHealthData)
router.get('/get-data',getHealthData)
router.get('/single-data/:id',getSingleHealthData)
router.patch('/update-data/:id',updateHealthData)
router.delete('/delete-data/:id',deleteHealthData)

module.exports = router