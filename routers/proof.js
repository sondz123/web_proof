const express = require('express')

const Proof = require('../models/proofModel')

const router = express.Router()

//Lấy danh sách minh chứng
router.get('/proof/list', async(req, res, next) => {
    try {

       const listProof = await Proof.find({}).skip(1);
       if(listProof){
        res.status(201).send( {listProof} ); 
       }
    }catch(error){
        res.send(error)
    }
   
})

//Tạo minh chứng
router.post('/proof/create', async (req, res) => {
    // Create a new proof
    try {
        const proof = new Proof(req.body)
        await proof.save()
        res.status(201).send({ proof })
    } catch (error) {
        res.status(400).send(error)
    }
})

//Sửa minh chứng
router.put('/proof/update/:id', async (req, res) => {
    // Create a new proof
    try {
        let idProof = req.params.id;

        var ObjProof = req.body;
        
        await Proof.updateOne({_id : Object(idProof)}, {"$set" : ObjProof})
        res.status(201).send("Update thành công")
    } catch (error) {
        res.status(400).send(error)
    }
})

//Xóa minh chứng
router.delete('/proof/delete/:id', async (req, res) => {
    // Create a new proof
    try {
        let idProof = req.params.id;

        await Proof.remove({"_id": Object(idProof)})
        res.status(201).send("Xóa thành công")
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router