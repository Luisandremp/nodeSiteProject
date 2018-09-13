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
const tokenVerification = require('../managers/tokenVerification.js');

router.get('/', async (req,res)=>{
    try {
        const result = await tokenVerification(req.headers);
        if (result.success && result.user.isAdmin===true) {  
            return res.status(200).send( await Manager.getUsers());
        } else {
            return res.status(401).send({errors: [{msg:"Unauthorized"}]}); 
        }
    } catch (error) {
        console.log('http error', error);
        return res.status(500).send(error);
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
        const hasErrors = validateFields(req, ['name', 'email']);

        if (hasErrors != false){
            return res.status(400).send({errors: hasErrors});
        }else{
            const result = await tokenVerification(req.headers);
            if (result.success && result.user.isAdmin===true) {
                return res.status(200).send( await  Manager.modifyUser(req.body, req.params.id));
            } else {
                return res.status(401).send({errors: [{msg:"Unauthorized"}]}); 
            }

        
        }
    } catch (error) {
        console.log('http error', error);
        return res.status(500).send();
    }     
});
//modify a password
router.put('/modifyPassword/:id', async (req,res)=>{
    try {
        return res.status(200).send( await  Manager.changePassword(req.body, req.params.id));
    } catch (error) {
        console.log('http error', error);
        return res.status(500).send();
    }     
});

module.exports = router;