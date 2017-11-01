var express 	= require("express"),
	router		= express.Router({mergeParams: true}),
	Camping 	= require("../models/camping");


router.get("/", function(req, res){
	Camping.find({}, function(err, allCampings){
		if(err){
			console.log(err);
		} else{
			res.render("campings/index", {camping: allCampings, currentUser: req.user});
		}
	});
});

router.post("/", isLoggedIn, function(req, res){
	var name = req.body.camping.name;
	var image = req.body.camping.image;
	var desc = req.body.camping.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}

	var newCamping = {name: name, image: image, description: desc, author: author};

	Camping.create(newCamping, function(err, newCamp){
		if(err){
			console.log(err);
		} else{
			res.redirect("/campings");
		}
	});
});

router.get("/new", isLoggedIn, function(req, res){
	res.render("campings/new")
});

router.get("/:id", function(req, res){
	Camping.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
		if(err){
			console.log(err);
		} else{
			res.render("campings/show", {camping: foundCamp});
		}
	});
});

router.get("/:id/edit",isAuthorizedCamp, function(req, res){
	Camping.findById(req.params.id, function(err, foundCamp){
		if(err){
			console.log(err);
			res.redirect("back");
		}else{
			res.render("campings/edit", {camping: foundCamp});
		}
	});
});

router.put("/:id", isAuthorizedCamp, function(req, res){
	Camping.findByIdAndUpdate(req.params.id, req.body.camping, function(err, updatedBlog){
		if(err){
			res.redirect("/campings")
		}else{
			res.redirect("/campings/" + req.params.id);
		}
	});
});

router.delete("/:id", isAuthorizedCamp, function(req, res){
	Camping.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campings");
		} else{
			res.redirect("/campings");
		}
	});
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};

function isAuthorizedCamp(req, res, next){
	if(req.isAuthenticated()){
		Camping.findById(req.params.id, function(err, foundCamp){
			if(err){
				res.redirect("/campings/" + req.params.id);
				} else{
				if(foundCamp.author.id.equals(req.user._id)){
					next();
				} else{
					res.redirect("/campings/" + req.params.id);
				}
			}
		});
	}else{
		res.redirect("/campings/" + req.params.id);
	};
};

module.exports = router;