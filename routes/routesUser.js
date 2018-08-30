const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser');
//Insertion and configuration of the body parser to return parsed request bodys
router.use(bodyparser.json());
router.use(bodyparser.urlencoded({ extended: false }));
const Manager = require('../managers/UserManager.js');

router.get('/', async (req,res)=>{
    try {
        console.log("getting users")
        return res.status(200).send(await Manager.getUsers());
    } catch (error) {
        console.log('http error', error);
        return res.status(500).send();
    }
});
//Get User by ID
router.get('/:id', async (req,res)=>{
    try {
        return res.status(200).send( await  Manager.getUserByID(req.params.id));
    } catch (error) {
        console.log('http error', error);
        return res.status(500).send();
    }      
});
//Delete User By Id
router.delete('/:id', async (req,res)=>{
    try {
        return res.status(200).send( await  Manager.deleteUser(req.params.id));
    } catch (error) {
        console.log('http error', error);
        return res.status(500).send();
    }     
});
//modify an user
router.put('/:id', async (req,res)=>{
    try {
        console.log(req.body)
        return res.status(200).send( await  Manager.modifyUser(req.body, req.params.id));
    } catch (error) {
        console.log('http error', error);
        return res.status(500).send();
    }     
});
//modify a password
router.put('/modifyPassword/:id', async (req,res)=>{
    try {
        console.log("!!!!!!!!!!!!! en route !!!!!!!!!!!!!!!!!!!")
        console.log("body: " ,req.body, "  params:   ", req.params.id)
        console.log("!!!!!!!!!!!!! en route !!!!!!!!!!!!!!!!!!!")
        return res.status(200).send( await  Manager.changePassword(req.body, req.params.id));
    } catch (error) {
        console.log('http error', error);
        return res.status(500).send();
    }     
});

module.exports = router;