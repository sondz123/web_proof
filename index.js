const express = require('express')
const userRouter = require('./routers/users')

const proofRouter = require('./routers/proof')
const port = 3000;
require('./db/db')

const app = express()

app.use(express.json())

app.use([userRouter, proofRouter])

//app.use()

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})