
const session = require('express-session')
const express = require('express');
const app = express();
const Manager = require('./managers/Manager.js');
Manager.constructor();


//Insertion of the Session Middle Ware, And Session Configuration
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, 
              maxAge: 1000*60*60*24 }
  }))


// cors fix
app.use(function (req, res, next) {


    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
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


//Test routes pour l'auth avec session
app.post('/', async (req,res)=>{
    try 
    {
        const data = {};
        
        if (req.body.username == "admin" && req.body.password === "admin") {
            console.log("success login in, saving session")
            req.session.user = "admin";   
            data.success = true;
            const token = jwt.sign({'email': req.session.user, 'userID': 'x'}, 
            'MysecretKey ',
            {expiresIn: "1h"} );
            console.log(token)
        } else {
            data.success = false;
        }
        console.log(req.session)
        return res.status(200).send(data);
        
    } catch (error) {
        console.log('http error', error);
        return res.status(500).send(error);
    }   
}
);
app.get('/', async (req,res)=>{
    
    try {
        
        const user = req.session.user
        let  data = {};

        console.log("Getting user from session: ", req.session.id);
        console.log("Getting user from session: ", req.session.user);
        if(user === "admin"){
            data = {'success': true,
            'message': "session works user is: "+user};
        }else{
            data = {'success': false,
            'message': "session dosent works user is: "+user};
        }
        return res.status(200).send(data);
    } catch (error) {
        console.log('http error', error);
        return res.status(500).send(error);
    }
});













  


