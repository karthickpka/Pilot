const express = require('express')
const app = express()

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
const expressLayouts = require('express-ejs-layouts')
app.use(expressLayouts)
app.set('layout', 'layouts/layout')

const session = require('express-session')
const passport = require('passport')
//not sure why order of request matters here !
app.use(session({
    secret: 'RANDOMSECRETSTRING',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
const initializePassport = require('./passport-config')
initializePassport(passport);

const flash = require('express-flash')
app.use(flash())

const methodOverride = require('method-override')
app.use(methodOverride('_method'))//_method used in logout form of ejs page  

app.get('/', checkNotAuthenticated, (req, res) => res.render('index'))
app.get('/homepage', checkAuthenticated, (req, res) => { res.render('./homepage/index', { username: req.user.username }) })
app.post('/homepage', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/homepage',
    failureRedirect: '/',
    failureFlash: true
}))

app.delete('/logout',
    (req, res) => {
        req.logOut()
        res.redirect('/')
    })

//Only authenticated requests go to next page others go to launchlogin page
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

//only non authenticated users should go to requested page - authenticated ones go to home page
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return res.redirect('/homepage');
    next();
}

app.listen(3000)
//IN branch