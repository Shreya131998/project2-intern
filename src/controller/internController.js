const mongoose = require("mongoose");
const collegeModel = require("../model/collegeModel");
const internModel = require("../model/internModel");

const isValidRequestBody = function (requestBody) {
  if (Object.keys(requestBody).length === 0) return false;
  return true;
};
const createIntern = async function (req, res) {
  try {
    
    let reqbody = req.body

    //if empty body
    if (!isValidRequestBody(reqbody)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide intern details - name, mobile, email, collegeName"});
    }
    
    let { name, mobile, email, collegeName } = reqbody;

    if (!name?.trim()) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide name" });
    }
    

    //Email validation
    if (!email?.trim()) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide email" });
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Email should be valid" });
    }
    const emailVerifiaction = await internModel.findOne({ email: email });
    if (emailVerifiaction) {
      return res
        .status(400)
        .send({ status: false, message: "Email already registered" });
    }


    //Mobile validation
    if (!mobile?.trim()) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide mobile number" });
    }
    if (!(/^\d{10}$/).test(mobile)) {

      return res
        .status(400)
        .send({ status: false, message: "Mobile no should be valid" });
    }
    const isUniqueMobile = await internModel.findOne({ mobile: mobile });
    if (isUniqueMobile) {
      return res
        .status(400)
        .send({ status: false, message: "Mobile no already registered" });
    }

    if(!collegeName){return res.status(400).send({status : false,message:"Please Enter College name"})}

    const getCollegeId = await collegeModel.findOne({ name: collegeName });
    if (!getCollegeId) {
      return res
        .status(404)
        .send({ status: false, message: "College not registered" });
    }

    //LOGIC
    const getId = getCollegeId._id;
  
    reqbody.collegeId = getId;
    reqbody.email = email.toLowerCase()
    const internDetails = await internModel.create(reqbody);
    return res.status(201).send({ status: true, data: internDetails });
    
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
}
module.exports = { createIntern };
