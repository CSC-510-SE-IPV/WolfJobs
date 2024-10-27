const User = require("../models/user");
const bcrypt = require('bcryptjs'); 

module.exports.profile = function(req,res){
    return res.render('user_profile', {
        title: 'User Profile'
    })
}


module.exports.signUp = function(req,res){

    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }


    return res.render('user_sign_up',{
        title: "WolfJobs | Sign Up"
    })
}


module.exports.signIn = function(req,res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }


    return res.render('user_sign_in',{
        title: "WolfJobs | Sign In"
    })
}


module.exports.create = async function(req, res) {
    try {
        if (req.body.password !== req.body.confirm_password) {
            return res.redirect('back');
        }

        // Check if user already exists
        let user = await User.findOne({ email: req.body.email });
        
        if (user) {
            return res.redirect('back'); // User already exists
        } else {
            // Hash the password
            const hashedPassword = await bcrypt.hash(req.body.password, 10); // 10 rounds of salt

            // Create new user with hashed password
            await User.create({
                email: req.body.email,
                password: hashedPassword,
                name: req.body.name,
            });

            return res.redirect('/users/sign-in');
        }
    } catch (err) {
        console.log('Error in creating user:', err);
        return res.redirect('back');
    }
};

//Sign In the user and create session for the user

module.exports.createSession = function(req,res){

    return res.redirect('/');

}

module.exports.destroySession = function(req,res){

    req.logout();
    
    return res.redirect('/')
}