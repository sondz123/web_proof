const { Timestamp } = require('mongodb');
const mongoose = require('mongoose')

const proofSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    code: {
        type: String,
        trim: true,
    },
    cap_ban_hanh: {
        type: Object,
        trim: true
    },
    so_van_ban: {
        type: String,
        trim: true
    },
    ngay_ban_hanh: {
        type: Date,
        default: Date.now,
    },
    ghi_chu: {
        type: String,
        trim: true
    },
    nhom_don_vi: {
        type: Object
    },
    don_vi: {
        type: Object
    },
    chuong_trinh : {
        type: Object
    },
    attachment: {
        type: Array
    },
    block_tieu_chuan_1: {
        tieu_chuan: {
           type: Object
        },
        tieu_chi: {
            type: Array
         }
    },
    block_tieu_chuan_2: {
        tieu_chuan: {
           type: Object
        },
        tieu_chi: {
            type: Array
         }
    },
    block_tieu_chuan_3: {
        tieu_chuan: {
           type: Object
        },
        tieu_chi: {
            type: Array
         }
    },
    namekd: String,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}

});

const Proof = mongoose.model('Proof', proofSchema)

module.exports = Proof