const { Timestamp } = require('mongodb');
const mongoose = require('mongoose')

const proofSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    code: {
        type: String,
        trim: true
    },
    cap_ban_hanh: {
        type: String,
        trim: true
    },
    so_van_ban: {
        type: String,
        trim: true
    },
    ngay_ban_hanh: {
        type: Number,
        trim: true,

    },
    ghi_chu: {
        type: String,
        trim: true
    },
    cap_quyen_don_vi: {
        type: Object,
        trim: true
    },
});

const Proof = mongoose.model('Proof', proofSchema)

module.exports = Proof