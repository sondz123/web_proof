const express = require('express')
const userRouter = require('./routers/users')

const proofRouter = require('./routers/proof')

const upload = require('express-fileupload')

require('./db/db')

const app = express()

app.use(express.json())

app.use([userRouter, proofRouter])
app.use(upload())
//cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.post("/upload/file", (req,res) => {
    if(req.files){
        let file = req.files.file;
        let fileName = file.name;
        let uploadPath = __dirname + "./uploads/" + fileName;

        file.mv(uploadPath, (err) => {
            if(err){
                res.send(err);
            }else {
                let dataFile = {
                    name: fileName,
                    size:  file.size,
                    path: uploadPath
                }
                res.json({
                    message :"File uploaded",
                    dataFile: dataFile
                })
            }
        })
    }
})



//app.use()
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})