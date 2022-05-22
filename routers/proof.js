const express = require('express')

const Proof = require('../models/proofModel')
const countRecordModel = require('../models/countRecord')
const { count } = require('../models/proofModel')
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
            res.status(200).json(ObjResult) 
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
        let countRecord = await countRecordModel.findOne({})
        let count = 0;
        if(countRecord){
            count = countRecord.count
        }else {
            const countRecord = new countRecordModel({"count" : 0})
            await countRecord.save()
        }

        const proof = new Proof(req.body);
        let tieu_chuan = req.body.block_tieu_chuan_1.tieu_chuan.key || 1;
        let tieu_chi = req.body.block_tieu_chuan_1.tieu_chi[0].key || 1;

        proof.code  = "" + tieu_chuan + "." + tieu_chi + "." + count ;
        
        Promise.all([await proof.save(), 
            await countRecordModel.updateOne({}, {$set : {count : count + 1}})])
        
        res.status(201).json({ 
         data: proof,
         message : "Thêm mới thành công"
        })
    } catch (error) {
        res.status(400).send({message : "Thêm mới thất bại"})
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

        let optionFind = {
            "block_tieu_chuan_1.tieu_chi.key" : {$ne : tieu_chi},
            "block_tieu_chuan_2.tieu_chi.key" : {$ne : tieu_chi},
            "block_tieu_chuan_3.tieu_chi.key" : {$ne : tieu_chi},
    }

        await Proof.find({optionFind})
        res.status(201).send("Xóa thành công")
    } catch (error) {
        res.status(400).send(error)
    }
})




module.exports = router