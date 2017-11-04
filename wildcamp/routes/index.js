var express 	= require("express"),
	router		= express.Router(),
	User 		= require("../models/user"),
	passport	= require("passport")

const { check, validationResult } = require('express-validator/check');

router.get("/register", function(req, res){
	res.render("users/register")
});

router.post("/register", [
	check("username", "Username must be at least 5 chars long").isLength({min: 5}),
	check("password", "Password must be at least 5 chars long").isLength({min: 5})
	] ,function(req, res){
		const errors = validationResult(req);
		if(!errors.isEmpty()){
			var message = errors.array().map(function (elem){
				return elem.msg;
			});
			req.flash("error", message);
			return res.redirect("/register");
		}
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "You have successfully signed in!");
			res.redirect("/campings");
		});
	});
});
router.get("/login", function(req, res){
	res.render("users/login");
});

router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campings",
		failureRedirect: "/login"
	}), function(req, res){

});

router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged You Out!");
	res.redirect("/campings");
});

router.get("/about", function(req, res){
	res.render("about");
});

router.get("/", function(req, res){
	res.render("landing");
});

module.exports = router;