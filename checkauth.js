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

module.exports.checkAuthenticated = checkAuthenticated;
module.exports.checkNotAuthenticated = checkNotAuthenticated;