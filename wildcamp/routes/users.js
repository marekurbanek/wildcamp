var express 	= require("express"),
	router		= express.Router({mergeParams: true}),
	User	 	= require("../models/user"),
	middleware	= require("../middleware");

router.get("/", function(req, res){
	User.find({}, function(err, foundUsers){
		if(err){
			res.redirect("/campings");
		} else{
			console.log(foundUsers);
			res.render("users/index", {users: foundUsers});
		}
	});
})

router.get("/:user_id", function(req, res){
	User.findById(req.params.user_id).populate("campings").exec(function(err, foundUser){
		if(err){
			res.redirect("/campings");
		} else{
			res.render("users/show", {user: foundUser, campingCount: foundUser.campings.length});
		}
	});
});

router.get("/:user_id/edit", function(req, res){
	User.findById(req.params.user_id, function(err, foundUser){
		if(err){
			res.redirect("/campings");
		} else{
			res.render("users/edit", {user: foundUser});
		}
	});
});

router.post("/:user_id", function(req, res){
	if(!req.files){
		return res.status(400).send('No files were uploaded.');
	} else{
		let image = req.files.image;
		image.mv("./public/users/images/" + req.params.user_id + ".jpg", function(err){
			if(err){
				return res.status(500).send(err);
			} else{
				res.redirect("/users/" + req.params.user_id);
			}
		});
	}

});

router.put("/:user_id", function(req, res){
	User.findByIdAndUpdate(req.params.user_id, req.body.user, function(err, updatedUser){
		if(err){
			console.log(err);
			res.redirect("/campings");
		} else{
			res.redirect("/users/" + req.params.user_id);
		}
	});
});

module.exports = router;

