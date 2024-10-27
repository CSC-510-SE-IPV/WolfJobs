const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');
const bcrypt = require('bcryptjs');

//Authentication using passport

passport.use(new LocalStrategy({
    usernameField: 'email', // Field to be used as username
    passwordField: 'password' // Field to be used as password
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return done(null, false, { message: 'Incorrect email or password.' });
        }

        // Compare the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect email or password.' });
        }

        return done(null, user); // Authentication successful
    } catch (err) {
        return done(err);
    }
}));

//Serializing the user to decide which key is to be kept in the cookies

passport.serializeUser(function(user, done){
    done (null, user.id);
})

//Deserializing the user from the key in the cookies

passport.deserializeUser(function(id, done){
    User.findById(id, function(err,user){
        if (err){
            console.log('Error in finding the user ---> Passport');
            return done(err)
        }

        return done(null, user)

    })
})


//Check if user is authenticated

passport.checkAuthentication = function(req, res, next){
    //if the user is signed in, pass on the request to the next function
    if (req.isAuthenticated()){
        return next();
    }

    //if the user is not signed in

    return res.redirect('/users/sign-in');
}


passport.setAuthenticatedUser = function(req,res,next){
    if (req.isAuthenticated()){
        //req.user contains the current signed in user from the session cookie and we are just sending this it to the locals for the view
        res.locals.user = req.user;
    }

    next();
    
}



module.exports = passport; 