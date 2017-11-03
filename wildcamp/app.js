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
	Comment 				= require("./models/comment"),
	flash					= require("connect-flash");

var campingRoutes = require("./routes/campings"),
	commentRoutes = require("./routes/comments"),
	indexRoutes	  = require("./routes/index");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

mongoose.connect('mongodb://orzechon:password@ds245885.mlab.com:45885/wildcamp');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
});

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser  = req.user;
    res.locals.error		= req.flash("error");
    res.locals.success		= req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campings", campingRoutes);
app.use("/campings/:id/comments", commentRoutes)

app.listen(process.env.PORT, process.env.IP, function() {

    // Callback called when server is listening
    console.log("Server listening on: http://localhost:%s8080");

});