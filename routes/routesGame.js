const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser');
//Insertion and configuration of the body parser to return parsed request bodys
router.use(bodyparser.json());
router.use(bodyparser.urlencoded({ extended: false }));
const Manager = require('../managers/Manager.js');

/**
 * Game
 */

//get Games list
router.get('/', async (req,res)=>{
    try {
        return res.status(200).send( await  Manager.getGames());
    } catch (error) {
        console.log('http error', error);
        return res.status(500).send();
    }
});
//Get Games by ID
router.get('/:id', async (req,res)=>{
    try {
        return res.status(200).send( await  Manager.getGameByID(req.params.id));
    } catch (error) {
        console.log('http error', error);
        return res.status(500).send();
    }      
});
//Delete Game By Id
router.delete('/:id', async (req,res)=>{
    try {
        return res.status(200).send( await  Manager.deleteGame(req.params.id));
    } catch (error) {
        console.log('http error', error);
        return res.status(500).send();
    }     
});
//insert an game
router.post('/', async (req,res)=>{
    try {
        return res.status(200).send( await  Manager.insertGame(req.body));
    } catch (error) {
        console.log('http error', error);
        return res.status(500).send(error);
    }     
});
//modify an user
router.put('/:id', async (req,res)=>{
    try {
        return res.status(200).send( await  Manager.modifyGame(req.body, req.params.id));
    } catch (error) {
        console.log('http error', error);
        return res.status(500).send();
    }     
});

module.exports = router;