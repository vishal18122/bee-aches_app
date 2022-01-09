if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');


const ejsMate = require('ejs-mate');
const Joi= require('joi');
const {beachSchema, reviewSchema} = require('./schemas.js');
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError');
const methodOverride = require("method-override");
const Beach = require('./models/beeaches');
const Review = require('./models/review');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const users = require('./routes/users')
const beaches = require('./routes/beaches');
const reviews = require('./routes/reviews');
const helmet = require('helmet');
const { dangerouslyDisableDefaultSrc } = require('helmet/dist/middlewares/content-security-policy');

const MongoStore = require('connect-mongo');

//CONNECTINF THE PAGE WITH DATABASE

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/Bee-aches';

// const dbUrl = process.env.DB_URL

mongoose.connect(dbUrl , {useNewUrlParser : true , useUnifiedTopology : true}).then(() => {
    console.log("CONNECTION OPEN!!");
})
.catch(err => {
    console.log("ERROR!!") 
    console.log(err);
})

const app = express();
app.engine('ejs' , ejsMate);
app.set('view engine' , 'ejs');
app.set('views' , path.join(__dirname , 'views'));

app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method')); // over riding the different requests
app.use(express.static(path.join(__dirname , 'public')));

// const store = new MongoDBStore ({
//     url :  dbUrl,
// });

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60 // = 14 days. Default
});

store.on("error" , function(e){
    console.log("SESSION STORE ERROR" , e);
})

const sessionConfig= {
    store,
    secret: 'thisisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires : Date.now() + (1000*60*60*24*7),
        maxAge: 1000*60*60*24*7
    },
    
}
app.use(session(sessionConfig));


app.use(flash());

app.use(helmet({contentSecurityPolicy : false}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');

    next();
})



app.use('/' , users);
app.use('/beaches',beaches);
app.use('/beaches/:id/reviews' , reviews);



app.get('/' , (req,res) => {    // home page
    res.render('home.ejs');
});


app.all('*' , (req,res,next) => {  //invalid page
    next(new ExpressError('Page Not Found' , 404));
})

app.use((err,req,res,next) => {
    const {statusCode = 500} = err;
    if(!err.message)err.message = "Oh No, Wrong Page "

    res.status(statusCode).render('error' , {err});
    
})

const port = process.env.PORT || 3000;

app.listen(port , () => {
    console.log(`LISTENING ON PORT ${port}` );

})