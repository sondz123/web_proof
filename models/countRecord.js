const { Timestamp } = require('mongodb');
const mongoose = require('mongoose')

const countRecord = mongoose.Schema({
    "count" : {
        type: Number
    }
});

const countRecordModel = mongoose.model('countRecord', countRecord)

module.exports = countRecordModel