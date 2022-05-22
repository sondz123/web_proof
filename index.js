const express = require('express')
const userRouter = require('./routers/users')

const proofRouter = require('./routers/proof')

const upload = require('express-fileupload')

require('./db/db')

const app = express()

app.use(express.json())

app.use([userRouter, proofRouter])
app.use(upload())
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.post("/", (req,res) => {
    if(req.files){
        let file = req.files.file;
        let fileName = file.name;
        console.log(fileName);

        file.mv('./uploads/'+ fileName, (err) => {
            if(err){
                res.send(err);
            }else {
                res.send("File uploaded")
            }
        })
    }
})



//app.use()
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})