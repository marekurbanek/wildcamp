var express 	= require("express"),
	router		= express.Router({mergeParams: true}),
	Camping 	= require("../models/camping"),
	User 		= require("../models/user"),
	middleware	= require("../middleware");
const { check, validationResult } = require('express-validator/check');


router.get("/", function(req, res){
	Camping.find({}, function(err, allCampings){
		if(err){
			console.log(err);
		} else{
			res.render("campings/index", {camping: allCampings, currentUser: req.user});
		}
	});
});

router.post("/", middleware.isLoggedIn, [
	check('camping.name', "Name must be at leat 5 chars long").isLength({min: 5}),
	check('camping.image', "You have to upload an image").isLength({min: 5}),
	check('camping.description', "Description can't be blank").isLength({min: 1}),
	check('camping.lat', "Latitude must be number").isDecimal(),
	check('camping.lng', "Longitude must be number").isDecimal()
	], function(req, res){
	const errors = validationResult(req);
	if(!errors.isEmpty()){
		var message = errors.array().map(function (elem){
			return elem.msg;
		});
		var camp = req.body.camping;
		console.log(camp);
		req.flash("error", message);
		return res.render("campings/new", {camping: camp, message: message});
	}
	var name = req.body.camping.name;
	var image = req.body.camping.image;
	var desc = req.body.camping.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var lat = req.body.camping.lat;
	var lng = req.body.camping.lng;

	var newCamping = {name: name, image: image, description: desc, author: author, lat: lat, lng: lng};

	User.findById(req.user._id, function(err, foundUser){
		if(err){
			res.redirect("/login");
		} else{
			Camping.create(newCamping, function(err, camping){
			if(err){
				console.log(err);
			} else{
				camping.save();
				foundUser.campings.push(camping);
				foundUser.save();
				res.redirect("/campings" + camping.id);
			}
		});
		};
	});
	
});

router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campings/new");
});

router.get("/:id", function(req, res){
	Camping.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
		if(err){
			res.redirect("/campings");
		} else{
			res.render("campings/show", {camping: foundCamp});
		}
	});
});

router.get("/:id/edit", middleware.isAuthorizedCamp, function(req, res){
	Camping.findById(req.params.id, function(err, foundCamp){
		if(err){
			console.log(err);
			res.redirect("back");
		}else{
			res.render("campings/edit", {camping: foundCamp});
		}
	});
});

router.put("/:id", middleware.isAuthorizedCamp, function(req, res){
	Camping.findByIdAndUpdate(req.params.id, req.body.camping, function(err, updatedCamp){
		if(err){
			res.redirect("/campings")
		}else{
			res.redirect("/campings/" + req.params.id);
		}
	});
});

router.delete("/:id", middleware.isAuthorizedCamp, function(req, res){
	Camping.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campings");
		} else{
			res.redirect("/campings");
		}
	});
});

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

module.exports = router;