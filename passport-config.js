const userModel = require('./models/users')
const localStrategy = require('passport-local').Strategy

function initialize(passport) {
    const authenticateUser = (username, password, done) => {

        userModel.findOne({ username: username })//users.find(users=>users.username===username)
            .then(user => {
                if (user == null)
                    return done(null, false, { message: 'no User with given name' });
                if (password == user.password) {
                    return done(null, user)
                }
                else
                    return done(null, false, { message: 'password incorrect' })
            })
    }
    passport.use(new localStrategy({ usernameField: 'username', passwordField: 'password' }, authenticateUser))//usernamefield given in html/ejs page
    passport.serializeUser((user, done) => {
        done(null, user.id);
    })
    passport.deserializeUser((id, done) => {
        userModel.findById(id, function(err, user) {
            done(err, user);
          }); 
    })
}
module.exports = initialize;