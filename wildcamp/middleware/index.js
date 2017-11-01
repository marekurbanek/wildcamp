var middleWareObj = {};

var Camping 	= require("../models/camping"),
	Comment 	= require("../models/comment");

middleWareObj.isAuthorizedCamp = function(req, res, next){
if(req.isAuthenticated()){
		Camping.findById(req.params.id, function(err, foundCamp){
			if(err){
				res.redirect("/campings/" + req.params.id);
				} else{
				if(foundCamp.author.id.equals(req.user._id)){
					next();
				} else{
					req.flash("error", "You don't have permission to do that!");
					res.redirect("/campings/" + req.params.id);
				}
			}
		});
	}else{
		res.redirect("/campings/" + req.params.id);
	};
};

module.exports = middleWareObj;

middleWareObj.isAuthorizedComment = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				console.log(err);
				res.redirect("/campings/" + req.params.id);
			} else{
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else{
					req.flash("error", "You don't have permission to do that!");
					res.redirect("/campings/" + req.params.id);
				};
			};
		});
	} else {
		res.redirect("/campings/" + req.params.id);
	};
};

middleWareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please Login first!");
	res.redirect("/login");
};