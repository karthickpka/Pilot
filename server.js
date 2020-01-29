const express = require('express')
const app = express()
const bodyParser = require('body-parser')

//Views
const expressLayouts = require('express-ejs-layouts')
app.use(expressLayouts)
app.set('layout', 'layouts/layout')
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }))

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
mongoose.connect('mongodb://localhost/mydb', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', error => console.error(error));
db.once('open', () => console.log('DB connected successfully'))

const auth = require('./checkauth')
app.get('/', auth.checkNotAuthenticated, (req, res) => res.render('index'))
app.get('/homepage', auth.checkAuthenticated,
    (req, res) => {
        //for EJs
        app.locals.shop = req.user.shop;
        res.render('./homepage/index', { username: req.user.username, shop: req.user.shop })
    })//req.user will be set by passport
app.post('/homepage', auth.checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/homepage',
    failureRedirect: '/',
    failureFlash: true
}))
app.get('/logout', auth.checkAuthenticated,
    (req, res) => {
        req.logOut()
        res.redirect('/')
    })

app.use('/inventory', auth.checkAuthenticated, require('./routes/inventroy'))//auth.checkAuthenticated,
app.use('/bills', auth.checkAuthenticated, require('./routes/bills'))

app.listen(3000, console.log(`Server started on port 3000`))
//IN branch