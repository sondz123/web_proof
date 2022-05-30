const express = require('express')

const Proof = require('../models/proofModel')
const countRecordModel = require('../models/countRecord')
const { count } = require('../models/proofModel')
const router = express.Router()


const  bodauTiengViet = function (str) {
    if (str != null) {
        str = str.toString();
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ|à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a").replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ|à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ|è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e").replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ|è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ|ì|í|ị|ỉ|ĩ/g, "i").replace(/ì|í|ị|ỉ|ĩ|ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o").replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ|ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u").replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ|ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ|ỳ|ý|ỵ|ỷ|ỹ/g, "y").replace(/ỳ|ý|ỵ|ỷ|ỹ|ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ|đ/g, "d").replace(/đ|đ/g, "d");
        str = str.replace(/[^a-zA-Z0-9]/g, '_');
        return str;
    }
    else { return ""; }
}


//Lấy danh sách minh chứng  
router.post('/proof/list', async(req, res, next) => {
    try {
        //dieu kien loc
        let perPage = req.body.perPage || 10; // số lượng sản phẩm xuất hiện trên 1 page
        let page = req.body.page || 1; 


        let name = req.body.name;
        
        var optionFind = {};

        if(req.body.name){
            optionFind["namekd"] = {"$regex": bodauTiengViet(name)};
        }
        if(req.body.cap_ban_hanh){
            optionFind["cap_ban_hanh.key"] = req.body.cap_ban_hanh;
        }
        if(req.body.tieu_chuan){
            optionFind["$or"] = [
                { "block_tieu_chuan_1.tieu_chuan.key" : req.body.tieu_chuan },
                { "block_tieu_chuan_2.tieu_chuan.key" : req.body.tieu_chuan },
                { "block_tieu_chuan_3.tieu_chuan.key" : req.body.tieu_chuan }
             ]
        }
        if(req.body.tieu_chi){
            optionFind["$and"] = [
                {"$or" : [
                    {"block_tieu_chuan_1.tieu_chi.key" : req.body.tieu_chi},
                    {"block_tieu_chuan_2.tieu_chi.key" : req.body.tieu_chi},
                    {"block_tieu_chuan_3.tieu_chi.key" : req.body.tieu_chi}
                ]}
            ]
        }

        await Proof.find(optionFind).sort({"createdAt" : -1})
       .skip((perPage * page) - perPage) 
       .limit(perPage)
       .exec((err, listProof) => {
        Proof.countDocuments((err, count) => { // đếm để tính có bao nhiêu trang
            if (err) return next(err);
            
            let ObjResult = {
                "total" : count,
                "listProof" : listProof,
                
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
        let count = 1;
        if(countRecord){
            count = countRecord.count
        }else {
            const countRecord = new countRecordModel({"count" : 1})
            await countRecord.save()
        }

        req.body.namekd = bodauTiengViet(req.body.name)
        const proof = new Proof(req.body);
        let tieu_chuan = req.body.block_tieu_chuan_1.tieu_chuan.key || 1;
        let tieu_chi = req.body.block_tieu_chuan_1.tieu_chi[0].key || 1;
        let chuonng_trinh = req.body.chuong_trinh ? req.body.chuong_trinh.key : 1;



        proof.code  = ""  + chuonng_trinh + "." + tieu_chuan + "." + tieu_chi + "." + count ;
        
        Promise.all([await proof.save(), await countRecordModel.updateOne({}, {$set : {count : count + 1}})])
        
        res.status(201).json({ 
         data: proof,
         message : "Thêm mới thành công"
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({message : error})
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
router.post('/proof/filter', async (req, res) => {
    try {
        let tieu_chi = req.body.tieu_chi;
        let tieu_chuan = req.body.tieu_chuan;
        let chuong_trinh = req.body.chuong_trinh;
        let optionFind = {};
        

        if(tieu_chuan){
            optionFind["$or"] = [
                { "block_tieu_chuan_1.tieu_chuan.key" : req.body.tieu_chuan },
                { "block_tieu_chuan_2.tieu_chuan.key" : req.body.tieu_chuan },
                { "block_tieu_chuan_3.tieu_chuan.key" : req.body.tieu_chuan }
             ]
        }
        if(tieu_chi){
            optionFind["$and"] = [
                {"$or" : [
                    {"block_tieu_chuan_1.tieu_chi.key" : tieu_chi},
                    {"block_tieu_chuan_2.tieu_chi.key" : tieu_chi},
                    {"block_tieu_chuan_3.tieu_chi.key" : tieu_chi}
                ]}
            ]
        }
        if(chuong_trinh){
            optionFind["chuong_trinh.key"] = chuong_trinh;
        }
        let list  = await Proof.find(optionFind)
        res.status(201).send(list)
    } catch (error) {
        res.status(400).send(error)
    }
})



module.exports = router