const asyncHandler = require('express-async-handler')
const Health = require('../model/healthModel')

const createHealthData = asyncHandler(async(req,res)=>{
    try{
        const healthData = await Health.create(req.body)
       res.json(healthData)
    }catch(error)
    {
        throw new Error(error)
    }
})

const getHealthData = asyncHandler(async(req,res)=>{
    try{
        const healthData = await Health.find()
        res.json(healthData)
    }catch(error)
    {
        throw new Error(error)
    }
})

const getSingleHealthData = asyncHandler(async(req,res)=>{
    try{
        const {id} = req.params
        const singleData = await Health.findById(id)
        res.json(singleData)
    }catch(error)
    {
        throw new Error(error)
    }
})

const updateHealthData = asyncHandler(async(req,res)=>{
    try{
        const {id} = req.params
        const updateData = await Health.findByIdAndUpdate(id,req.body,{new:true})
        res.json(updateData)
    }catch(error)
    {
        throw new Error(error)
    }
})

const deleteHealthData = asyncHandler(async(req,res)=>{
    try{
        const {id} = req.params
        const deleteData = await Health.findByIdAndDelete(id)
        res.json(deleteData)
    }catch(error)
    {
        throw new Error(error)
    }
})

module.exports ={
    createHealthData,getHealthData,getSingleHealthData,updateHealthData,deleteHealthData
}