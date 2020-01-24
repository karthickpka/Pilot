const express = require('express')
const router = express.Router()
const auth = require('../checkauth')

module.exports= function routeFunction(passport)
{
router.get('/homepage', auth.checkAuthenticated, (req, res) => { res.render('./homepage/index', { username: req.user.username }) })//req.user will be set by passport
router.post('/homepage', auth.checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/homepage',
    failureRedirect: '/',
    failureFlash: true
}))
} 
