//@ts-check
const collegeModel=require("../model/collegeModel")
const internModel = require("../model/internModel")
// const isValid=function(value){
//     if(typeof value ===undefined || value===null)return false 
//     if(typeof value===String && value.trim().length===0)return false 
//     return true
// }
const isValidRequestBody=function(requestBody){
    if(Object.keys(requestBody).length===0)return false 
    return true 
}

const createCollege=async function(req,res){
    try{
        const reqbody=req.body 
        if(!isValidRequestBody(reqbody)){return res.status(400).send({status:false,message:"Please provide college details"})}
        const {name,fullName,logoLink}=reqbody
        if(!name?.trim()){
            return res.status(400).send({status:false,message:"Please provide name"})
        }
        const checkname = await collegeModel.findOne({name:reqbody.name})
        if(checkname){return res.status(400).send({status:false,message:"College already registered"})}
        if(!fullName?.trim()){
            return res.status(400).send({status:false,message:"Please provide fullname"})

        }
        if(!logoLink?.trim()){
            return res.status(400).send({status:false,message:"Please provide logoLink"})


        }
        if(!/^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/.test(logoLink)){
            return res.status(400).send({status:false,message:"please provide valid link"})
        }
        const collegeDetails=await collegeModel.create(reqbody)
        return res.status(201).send({status:true,data:collegeDetails})


    }
    catch(err){
        return res.status(500).send({msg:err.message})
    }
}

//GET /functionup/collegeDetails



const collegeDetails = async function(req,res){
    try{
    const {collegeName} = req.query

    if(!collegeName){
        return res.status(404).send({status:false,message:"Page not found"})
    }  
    let getlowername = collegeName.toLowerCase();        
    let findCollegeDetail = await collegeModel.findOne({name:getlowername,isDeleted:false}).select({createdAt:0,updatedAt:0,__v:0})
    if(!findCollegeDetail){return res.status(404).send({status : false,message :"College not found"})}
   

    let findInternList = await internModel.find({collegeId :findCollegeDetail._id,isDeleted:false}).select({isDeleted:0,__v:0})
    if(findInternList.length===0){
        findCollegeDetail.interests="no intern found"
    }
    else{
        findCollegeDetail.interests=findInternList
    }
    
    findCollegeDetail.interests = findInternList
     let finalObj ={}
     finalObj.name = findCollegeDetail.name
     finalObj.fullName = findCollegeDetail.fullName
     finalObj.logoLink = findCollegeDetail.logoLink
     finalObj.interests = findCollegeDetail.interests

    return res.status(200).send({data:finalObj})
    }catch(error){
        res.status(500).send({status: false, message: error.message})
    }
    



}

module.exports={createCollege,collegeDetails}