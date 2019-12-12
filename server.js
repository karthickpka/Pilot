const express = require('express')
const app = express()

//Views
const expressLayouts = require('express-ejs-layouts')
app.use(expressLayouts)
app.set('layout', 'layouts/layout')
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

//Session Management
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

//Views
const flash = require('express-flash')
app.use(flash())

//Model
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/mydb',{useNewUrlParser:true,useUnifiedTopology: true})
const db=mongoose.connection
db.on('error',error=>console.error(error));
db.once('open',()=>console.log('DB connected successfully'))


app.get('/', checkNotAuthenticated, (req, res) => res.render('index'))
app.get('/homepage', checkAuthenticated, (req, res) => { res.render('./homepage/index', { username: req.user.username }) })//req.user will be set by passport
app.post('/homepage', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/homepage',
    failureRedirect: '/',
    failureFlash: true
}))
app.get('/logout',
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

app.listen(3000,console.log(`Server started on port 3000`))
//IN branch