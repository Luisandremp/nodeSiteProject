
const express = require('express');
const app = express();
const Manager = require('./managers/Manager.js');
const UserManager = require('./managers/UserManager.js');
Manager.constructor();
const sanitizeUser=  require('./managers/sanitizeUser.js');
const tokenVerification = require('./managers/tokenVerification.js');

const bodyparser = require('body-parser');
//Insertion and configuration of the body parser to return parsed request bodys
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

// cors fix
app.use(function (req, res, next) {


    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://192.168.20.102');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers',  "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    //google api security policy
    res.setHeader("Content-Security-Policy", "script-src 'self' https://apis.google.com");
    

    // Pass to next layer of middleware
    next();
});

const TOKENSECRET = "q5s1dsq6465qsdq";
const jwt = require('jsonwebtoken');
/*const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

//PASSPORT  
const passport = require('passport');

//Strategy pour valider les session atravers de tokens
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : TOKENSECRET
},
function (jwtPayload, cb) {
    console.log("using JWTStrategy!!!!!!!!!!!!!!!!!!!!!!")
    
    //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
   return UserManager.getUserByID(jwtPayload.id)
        .then(result => {  
            const user = sanitizeUser(result.user.dataValues);
            
            return cb(null, user);
        })
        .catch(err => {
            console.log("error: ",err)
            return cb(err);
        });
}
));*/


/*
//Serializer to send user 
passport.serializeUser(function(user, done) {
    console.log("Serializing User!!!!!!!!!!!!!!!!")
    done(null, user.email);
  });
  
passport.deserializeUser(async function(email, done) {
    try{
        const result = await UserManager.getUserByEmail(email);
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
});*/



app.get('/', async (req,res)=>{

    try {
        //if token exists and its verified get the user from DB and send it to client
        const result = await tokenVerification(req.headers);
        if (result.success) {
            const user = sanitizeUser(result.user);
            return res.status(200).send(user);
        } else {
            return res.status(401).send(result); 
        }
    } catch (error) {
        console.log('http error', error);
        return res.status(500).senderror
    }
});




/**
 * Importing the different Routes for the different services
 */

 //USER services
 const users = require('./routes/routesUser.js');
 app.use('/users', users);
  //Authentication services
 const auth = require('./routes/routesAuthentification.js');
 app.use('/auth', auth);
  //Game Services services
 const game = require('./routes/routesGame.js');
 app.use('/game', game);
  //Player Statistics services
 const playerStatistics = require('./routes/routesPlayerStatistics.js');
 app.use('/statistics', playerStatistics);



 // Listen to port 5000
app.listen(5000, ()=>{
    console.log('express server is running at port 5000')
});



/*
app.get('/test', passport.authenticate('jwt', { session: false}),async (req,res)=>{
    console.log(req.isAuthenticated())
    const token = getToken(req.headers);
    // verify a token symmetric - synchronous
    const decoded = jwt.verify(token, TOKENSECRET);


        try {
            return res.status(200).send(await UserManager.getUsers());
        } catch (error) {
            console.log('http error', error);
            return res.status(500).send();
        }
      
});*/


app.get('/helloWorld', (req,res)=>{   
    return res.status(200).send("Hello World!");     
});











  


