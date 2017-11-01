var express 	= require("express"),
	router		= express.Router({mergeParams: true}),
	Camping 	= require("../models/camping"),
	Comment 	= require("../models/comment");


router.get("/new", function(req, res){
	Camping.findById(req.params.id, function(err, foundCamp){
		if(err){
			res.redirect("/campings")
		} else{
			res.render("comments/new", {camping: foundCamp});
		}
	});
	
});

router.post("/", isLoggedIn, function(req, res){
	Camping.findById(req.params.id, function(err, foundCamp){
		if(err){
			console.log(err);
			res.redirect("/campings");
		} else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
					res.redirect("/campings");
				} else{
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					foundCamp.comments.push(comment);
					foundCamp.save();
					res.redirect("/campings/" + foundCamp._id);
				}
			}
		)};
	});
});

router.get("/:comment_id/edit", isAuthorizedComment, function(req, res){
	foundCamp = req.params.id;
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else{
			res.render("comments/edit", {comment: foundComment, camping: foundCamp});
		}
	});
});

router.put("/:comment_id", isAuthorizedComment, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else{
			res.redirect("/campings/" + req.params.id);
		}
	});
});

router.delete("/:comment_id", isAuthorizedComment, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err, deletedComment){
		if(err){
			console.log(err);
			res.redirect("back");
		} else{
			res.redirect("/campings/" + req.params.id);
		}
	});
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};

function isAuthorizedComment(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				console.log(err);
				res.redirect("/campings/" + req.params.id);
			} else{
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else{
					res.redirect("/campings/" + req.params.id);
				};
			};
		});
	} else {
		res.redirect("/campings/" + req.params.id);
	};
};

module.exports = router;