var express					= require("express"),
	app						= express(),
	bodyParser				= require("body-parser"),
	mongoose				= require("mongoose"),
	passport				= require("passport"),
	LocalStrategy			= require("passport-local"),
	passportLocalMongoose	= require("passport-local-mongoose"),
	Camping 				= require("./models/camping"),
	User					= require("./models/user"),
	methodOverride 			= require("method-override"),
	Comment 				= require("./models/comment")

var campingRoutes = require("./routes/campings"),
	commentRoutes = require("./routes/comments"),
	indexRoutes	  = require("./routes/index");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));


mongoose.connect('mongodb://localhost/app');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
});

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRoutes);
app.use("/campings", campingRoutes);
app.use("/campings/:id/comments", commentRoutes)

app.listen(8080, function() {

    // Callback called when server is listening
    console.log("Server listening on: http://localhost:%s8080");

});