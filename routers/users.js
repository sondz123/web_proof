const express = require('express')
const User = require('../models/userModel')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/users', async (req, res) => {
    // Create a new user
    try {
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

//Đổi mật khẩu
router.put('/users/changepassword', async (req, res) => {
    try{
        const { email, password } = req.body
        const user = await User.findByCredentials(email, password)
        if (!user) {
            return res.status(401).send({error: 'Thông tin tài khoản không chính xác. Vui lòng kiểm tra lạiĂ'})
        }
        await user.save()
        res.status(201).send({ user })
    } catch (error){
        res.status(400).send(error)
    }

})

router.post('/users/login', async(req, res) => {
    //Login a registered user
    try {
        const { email, password } = req.body

        const user = await User.findByCredentials(email, password)
        if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        }
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/users/me', auth, async(req, res) => {
    // View logged in user profile
    res.send(req.user)
})

router.post('/users/me/logout', auth, async (req, res) => {
    // Log user out of the application
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/users/me/logoutall', auth, async(req, res) => {
    // Log user out of all devices
    try {
        req.user.tokens.splice(0, req.user.tokens.length)
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})


router.get('/users/getall', async(req, res) => {
    try{
        let listUser = await User.find({})
        res.status(200).send(listUser)
    } catch(error){
        res.status(500).send(error)
    }
})



module.exports = router;