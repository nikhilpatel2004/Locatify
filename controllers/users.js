const  User = require("../models/user.js");

module.exports.renderSignup =(req,res) =>{
    res.render("users/signup.ejs");
};




module.exports.signup = async (req, res, next) => {
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        // console.log(registeredUser); // Is line ko comment ya remove kar dein
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup"); // This was correct, but I'm including it for clarity
    }
};

module.exports.renderLogin = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout =  (req, res, next) => {
    req.logout((err) => {
        if(err) { return next(err); }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};