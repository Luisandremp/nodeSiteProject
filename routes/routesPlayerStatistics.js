const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bodyparser = require('body-parser');
//Insertion and configuration of the body parser to return parsed request bodys
router.use(bodyparser.json());
router.use(bodyparser.urlencoded({ extended: false }));
const Manager = require('../managers/Manager.js');



router.get('/gamesOfPlayer/:id', async (req,res)=>{
    try {
        return res.status(200).send( await  Manager.gamesOfPlayer(req.params.id));
    } catch (error) {
        console.log('http error', error);
        return res.status(500).send();
    }     
});

router.post('/postPlayerStatistics', async (req, res)=>{
    try {
        return res.status(200).send( await  Manager.insertOrUpdatePlayerStatistics(req.body));
    } catch (error) {
        console.log('http error', error);
        return res.status(500).send();
    }

})
router.post('/newGameStatistics', async (req, res)=>{
    try {
        return res.status(200).send( await  Manager.createNewGameStatistics(req.body));
    } catch (error) {
        console.log('http error', error);
        return res.status(500).send();
    }
})


module.exports = router;