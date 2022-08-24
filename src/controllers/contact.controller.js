
'use strict'

var User = require('../models/user.model');
var Contact = require('../models/contact.model');
const { validateData, checkPermission, findUserById, checkUpdate } = require('../utils/validate');

exports.test = (req, res)=>{
    try{
        return res.send({message: 'Test running'});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error'})
    }
}


exports.saveContact = async(req, res)=>{
    try{
        const userId = req.params.idU;
        const params = req.body;
        let data = {
            name: params.name,
            phone: params.phone,
            birthday: params.birthday
        }
        
        let msg = await validateData(data);
        if(msg) return res.status(400).send(msg);
        const permission = await checkPermission(userId, req.user.sub);
        if(permission === false) return res.status(401).send({message: 'You dont have permission to update this user'});
        const userExist = await findUserById(userId);
        if(!userExist) return res.status(404).send({message: 'User not found'});
        const contact = new Contact(data);
        const contactSaved = await contact.save();
        await User.findOneAndUpdate({_id: userId}, {$push:{contacts: contactSaved._id}})
        return res.send({message: 'Contact added successfully'});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error adding contact'});
    }
}

exports.getContacts = async(req, res)=>{
    try{
        const userId = req.params.id;

        const permission = await checkPermission(userId, req.user.sub);
        if(permission === false) return res.status(401).send({message: 'You dont have permission to update this contact'});
        const userContacts = await User.findOne({_id: userId}).populate('contacts');
        return res.send({contacts: userContacts.contacts});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error getting contacts'});
    }
}

exports.update = async(req, res)=>{
    try{
        const userId = req.params.idU;
        const contactId = req.params.idC;
        const params = req.body;

        const permission = await checkPermission(userId, req.user.sub);
        if(permission === false) return res.status(401).send({message: 'You dont have permission to update this contact'});
        const validateUpdate = await checkUpdate(params);
        if(validateUpdate === false) return res.status(400).send({message: 'Cannot update this information or invalid params'});
        const userWithContact = await User.findOne({_id: userId, contacts: contactId});
        if(!userWithContact) return res.status(404).send({message: 'User with this contact not fond'});
        await Contact.findOneAndUpdate({_id: contactId}, params);
        return res.send({message: 'Contact updated successfully'});
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error updating contact'});
    }
}

exports.delete = async(req, res)=>{
    try{
        const userId = req.params.idU;
        const contactId = req.params.idC;

        const permission = await checkPermission(userId, req.user.sub);
        if(permission === false) return res.status(401).send({message: 'You dont have permission to delete this contact'});
        const removeContact = await User.findOneAndUpdate({_id: userId}, {$pull:{contacts: contactId}});
        if(!removeContact) return res.status(500).send({message: 'Error removing contact'});
        await Contact.findOneAndDelete({_id: contactId});
        return res.send({message: 'Contact delted successfully'});
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error deleting contact'});
    }
}