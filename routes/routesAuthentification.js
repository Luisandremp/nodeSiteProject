const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser');
//Insertion and configuration of the body parser to return parsed request bodys
router.use(bodyparser.json());
router.use(bodyparser.urlencoded({ extended: false }));
const expressValidator = require('express-validator');
router.use(expressValidator());
const Manager = require('../managers/UserManager.js');
const validateFields = require('../managers/validateFields.js');
const sanitizeUser = require('../managers/sanitizeUser.js');

const TOKENSECRET = "q5s1dsq6465qsdq";
const jwt = require('jsonwebtoken');
/*const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

//PASSPORT  
const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;



router.use(passport.initialize());
router.use(passport.session()); // persistent login sessions
*/
//express config

/*

//Serializer to send user info to the session
passport.serializeUser(function(user, done) {
    done(null, user.email);
  });
  
passport.deserializeUser(async function(email, done) {
    try{
        const result = await Manager.getUserByEmail(email);
        if (result.success) {
            done(null, result.user.email);
        }else{
            console.log("error deserializing ",result.msg)
            done(true, result.msg);
        }      
    }catch(error){
        console.log("error deserializing ",error)
        done(true, error);
    }   
});
*/
/*
passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, 
    function (email, password, cb) {
        //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
        const obj = {'email': email, 'password': password};
        return Manager.loginUser(obj)
           .then(result => {
               if (!result) {
                   return cb(null, false, {message: 'Incorrect email or password.'});
               }
               
               const user = sanitizeUser(result.user.dataValues);
               return cb(null, user, {message: 'Logged In Successfully'});
          })
          .catch(err => cb(err));
    }
));


/* //POST login.
router.post('/login2', function (req, res, next) {
    passport.authenticate('local', {session: false}, (err, userInfo, info) => {
        if (err || !userInfo) {
            return res.status(400).json({
                message: 'Something is not right',
                user   : userInfo
            });
        }
       req.login(userInfo, {session: false}, (err) => {
           if (err) {
               res.send(err);
           }

           // generate a signed son web token with the contents of user object and return it in the response
           const user = sanitizeUser(userInfo);
           const token = jwt.sign(user, TOKENSECRET);
           return res.json({user, token});
        });
    })(req, res);
});
*/



/*
passport.use(new FacebookStrategy({
    clientID: 1720830888037855,
    clientSecret: "4d7980eff38605ca970f9c399970f661",
    callbackURL: "http://localhost:5000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'email']
  },
  async function(accessToken, refreshToken, profile, cb) {
    const user = {'name': profile._json.name, 'email':  profile._json.email, 'facebookId':profile._json.id  }
    //console.log(profile)
    const result = await Manager.getUserOrCreate(user);
    if (result.success) {
        return cb(null, result.user);
    }else{
        return cb(false , result.msg);
    }
  }
));

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: "864813520864-uidekfqluddgaom07500i9me7vlq5tom.apps.googleusercontent.com",
    clientSecret: "_FVCrTYYb3j0eE-q4b87A6YR",
    callbackURL: "http://localhost:5000/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    
    const user = {'name': profile._json.displayName, 'email': profile._json.emails[0].value, 'googleTag':profile._json.etag }
    //console.log('Google tag', profile._json.etag)
    const result = await Manager.getUserOrCreate(user);
    if (result.success) {
        return done(null, result.user);
    }else{
        return done( result.msg, result.msg);
    }
  }
));


//service the authentification facebook
router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'] }));

//callback de facebook
router.get('/facebook/callback',
    passport.authenticate('facebook'),
        async function(req, res) {
            const result = await Manager.getUserOrCreate(req.user).catch(function (error) {
                console.log(error)
            })
            const user = sanitizeUser(result.user);
            const token = jwt.sign(user, TOKENSECRET);
            return res.json({user, token});       
            return res.redirect('http://localhost/node/nodeSequelize/vueClient/')
        }
);


// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.get('/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login',
  'https://www.googleapis.com/auth/plus.profile.emails.read'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/google/callback', 
  passport.authenticate('google'),
  async function(req, res) { 
    const result = await Manager.getUserOrCreate(req.user);
    const user = sanitizeUser(result.user);
    const token = jwt.sign(user, TOKENSECRET);
    return res.json({user, token});
    return res.status(200).json(result);
     //res.redirect('http://localhost/node/nodeSequelize/vueClient/');
  });

*/
/*
router.post('/login', async (req,res)=>{
    try {
        const hasErrors = validateFields(req, ['email', 'password']);
        if (hasErrors != false){
            return res.status(400).send({errors: hasErrors});
        }else{
            const result = await Manager.loginUser(req.body);
            if (result.success ) {
                return res.status(200).send(result.user);
            }else{
                return res.status(400).send({errors: result}); 
            }  
        }     
    } catch (error) {
        console.log('http error', error);
        return res.status(400).send(error);
    }   
});*/



//login an user
router.post('/login3', async (req,res)=>{
    try {
        const hasErrors = validateFields(req, ['email', 'password']);

        if (hasErrors != false){
            return res.status(400).send({errors: hasErrors});
        }else{
           const result = await Manager.loginUser(req.body)
           .catch((e)=>{console.log(e)});

           if (result.success ) {
               
                // generate a signed son web token with the contents of user object and return it in the response
                const user = sanitizeUser(result.user);
                const token = jwt.sign(user, TOKENSECRET);
                return res.json({user, token});
            }else{
                console.log('Login failed : ', result)
                return res.status(400).send({errors: result}); 
            } 
        }
    } catch (error) {
        console.log('http error', error);
        return res.status(400).send(error);
    }     
});


//REGISTER an user
router.post('/register', async (req,res)=>{
    try {
        const hasErrors = validateFields(req, ['name', 'email', 'password', 'passwordMatch']);

        if (hasErrors != false){
            return res.status(400).send({errors: hasErrors});
        }else{
           const result = await Manager.insertUser(req.body)
           .catch((e)=>{console.log(e)});
           if (result.success ) {
                // generate a signed son web token with the contents of user object and return it in the response
                const user = sanitizeUser(result.user);
                const token = jwt.sign(user, TOKENSECRET);
                return res.json({user, token});
            }else{
                console.log('Register failed : ', result)
                return res.status(400).send({errors: result}); 
            } 
        }
    } catch (error) {
        console.log('http error', error);
        return res.status(400).send(error);
    }     
});

module.exports = router;