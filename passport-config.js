const users = [
    { username: 'User1', password: 'Password1' }, 
    { username: 'User2', password: 'Password2' }]

const localStrategy = require('passport-local').Strategy

function initialize(passport) {
    const authenticateUser = (username, password, done) => {
        
        const user=users.find(users=>users.username===username)
        if (user == null)
            return done(null, false, { message: 'no User with given name' });
        if (password == user.password) {
            return done(null, user)
        }
        else
            return done(null, false, { message: 'password incorrect' })
    }
    passport.use(new localStrategy({ usernameField: 'username', passwordField: 'password' },authenticateUser))//usernamefield given in html/ejs page
    
    passport.serializeUser((user, done) => { 
        done(null,user.username);
    })
    passport.deserializeUser((username, done) => {
        done(null,users.find(users=>users.username===username))
     })
}
module.exports = initialize;