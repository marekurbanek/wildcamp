var express 	= require("express"),
	router		= express.Router({mergeParams: true}),
	Camping 	= require("../models/camping"),
	Comment 	= require("../models/comment"),
	middleware	= require("../middleware");
const { check, validationResult } = require('express-validator/check');

router.get("/new", middleware.isLoggedIn, function(req, res){
	Camping.findById(req.params.id, function(err, foundCamp){
		if(err){
			res.redirect("/campings")
		} else{
			res.render("comments/new", {camping: foundCamp});
		}
	});
	
});

router.post("/", middleware.isLoggedIn, [
	check('comment.text', "Comment can't be blank").isLength({min: 1})
	],function(req, res){
		const errors = validationResult(req);
		if(!errors.isEmpty()){
			var message = errors.array().map(function (elem){
				return elem.msg;
			});
			req.flash("error", message);
			return res.redirect("/campings/" + req.params.id);
	}
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

router.get("/:comment_id/edit", middleware.isAuthorizedComment, function(req, res){
	foundCamp = req.params.id;
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else{
			res.render("comments/edit", {comment: foundComment, camping: foundCamp});
		}
	});
});

router.put("/:comment_id", middleware.isAuthorizedComment, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else{
			res.redirect("/campings/" + req.params.id);
		}
	});
});

router.delete("/:comment_id", middleware.isAuthorizedComment, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err, deletedComment){
		if(err){
			console.log(err);
			res.redirect("back");
		} else{
			res.redirect("/campings/" + req.params.id);
		}
	});
});


module.exports = router;