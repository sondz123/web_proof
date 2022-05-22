const express = require('express')

const Proof = require('../models/proofModel')

const router = express.Router()

//Lấy danh sách minh chứng  
router.get('/proof/list', async(req, res, next) => {
    try {
        //dieu kien loc
        let perPage = req.params.perPage || 10; // số lượng sản phẩm xuất hiện trên 1 page
        let page = req.params.page || 1; 
       const listProof = await Proof.find()
       .skip((perPage * page) - perPage) 
       .limit(perPage)
       .exec((err, listProof) => {
        Proof.countDocuments((err, count) => { // đếm để tính có bao nhiêu trang
            if (err) return next(err);
            let ObjResult = {
                "total" : count,
                "listProof" : listProof
            }
            res.json(ObjResult) 
          });
       });
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
        res.status(201).json({ proof })
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

//Lọc minh chứng
router.get('/proof/filter', async (req, res) => {
    try {
        let tieu_chi = req.params.tieu_chi;

        await Proof.find({})
        res.status(201).send("Xóa thành công")
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router