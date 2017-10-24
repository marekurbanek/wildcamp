var express					= require("express"),
	app						= express(),
	bodyParser				= require("body-parser"),
	mongoose				= require("mongoose"),
	passport				= require("passport"),
	LocalStrategy			= require("passport-local"),
	passportLocalMongoose	= require("passport-local-mongoose"),
	Camping 				= require("./models/camping"),
	User					= require("./models/user"),
	methodOverride 			= require("method-override")

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

mongoose.connect('mongodb://localhost/app');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});


app.get("/", function(req, res){
	res.render("landing");
});

app.get("/campings", function(req, res){
	Camping.find({}, function(err, allCampings){
		if(err){
			console.log(err);
		} else{
			res.render("campings/index", {camping: allCampings});
		}
	});
});

app.get("/campings/new", function(req, res){
	res.render("campings/new")
});

app.post("/campings", function(req, res){
	var newCamping = req.body.camping;
	Camping.create(newCamping, function(err, newCamp){
		if(err){
			console.log(err);
		} else{
			res.redirect("/campings");
		}
	});
});

app.get("/campings/:id", function(req, res){
	Camping.findById(req.params.id, function(err, foundCamp){
		if(err){
			console.log(err);
			res.send("I couldn't find that camping");
		}
		else{
			res.render("campings/show", {camping: foundCamp});
		}
	})
});

app.get("/campings/:id/edit", function(req, res){
	Camping.findById(req.params.id, function(err, foundCamp){
		if(err){
			console.log(err);
			res.send("I couldn't find that camp");
		}else{
			res.render("campings/edit", {camping: foundCamp});
		}
	})
});

app.put("/campings/:id", function(req, res){
	Camping.findByIdAndUpdate(req.params.id, req.body.camping, function(err, updatedBlog){
		if(err){
			res.redirect("/campings")
		}else{
			res.redirect("/campings/" + req.params.id);
		}
	})
});



app.get("/login", function(req, res){
	res.render("login");
});

app.post("/login", function(req, res){

});







app.listen(8080, function() {

    // Callback called when server is listening
    console.log("Server listening on: http://localhost:%s8080");

});