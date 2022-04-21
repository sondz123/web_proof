const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/myWeb', {
    useNewUrlParser: true,
})