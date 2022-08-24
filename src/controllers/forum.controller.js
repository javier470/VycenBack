'use strict'


const Forum = require('../models/forum')
const moment = require('moment')
const { validExtension, validateData } = require('../utils/validate');
const date = new Date();

exports.sendMessage = async (req, res) => {
    try {
        const userId = req.user.sub;
        const params = req.body;
        const data = {
            user: userId,
            message: params.message,
            date: date,
        }
        const msg = validateData(data)
        if (msg) return res.status(400).send(msg);
        const spam = await Forum.find({ message: params.message, date: date });
        if (spam.length >= 5) {
            return res.status(401).send({ message: 'Warning, please wait to send this message' })
        };
        const message = new Forum(data);
        await message.save();
        return res.send({ message: 'Message sended' });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}

exports.getMessages = async (req, res) => {
    try {
        const forum = await Forum.find().populate('user');
        if (!forum) return res.status(404).send({ message: 'Messages not found.' });
        return res.send({ message: 'Messages found:', forum });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}

exports.getMessage = async (req, res) => {
    try {
        const forumId = req.params.id;
        const forum = await Forum.findOne({ _id: forumId })
        if (!forum) return res.status(404).send({ message: 'Message not found.' });
        return res.send({ message: 'Message found:', forum });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}

exports.deleteMessage = async (req, res) => {
    try {
        const forumId = req.params.id;
        const forum = await Forum.findOne({ _id: forumId });
        if (forum.user != req.user.sub) return res.send({ message: 'You can\'t delete this message' });
        const deleteF = await Forum.findByIdAndDelete({ _id: forumId });
        if (!deleteF) return res.status(500).send({ message: 'Can not delete this message' });
        return res.send({ message: 'Message deleted' })
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}


/*
exports.addImage = async (req, res) => {
    try {
        const params = req.body;
        const data = {
            user: req.user.sub,
            image: req.files.image.path,
            description: params.description
        }


        let pathFile = './uploads/forum/';
        if (!req.files.image || !req.files.image.type) return res.status(400).send({ message: 'Havent sent image' });
        //ruta en la que llega la imagen
        const filePath = req.files.image.path; // \uploads\sers\file_name.ext
        //separar en jerarquía la ruta de la imágen (linux o MAC: ('\'))
        const fileSplit = filePath.split('\\');// fileSplit = ['uploads', 'users', 'file_name.ext']
        const fileName = fileSplit[2];// fileName = file_name.ext

        const extension = fileName.split('\.'); // extension = ['file_name', 'ext']
        const fileExt = extension[1]; // fileExt = ext;

        const validExt = await validExtension(fileExt, filePath);
        if (validExt === false) return res.status(400).send({ message: 'Invalid extension' });

        const forumImg = new Forum(data);
        await forumImg.save();

        return res.status(200).send({ message: 'Image added successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}

exports.getImage = async (req, res) => {
    try {
        const fileName = req.params.fileName;
        const pathFile = './uploads/img/' + fileName;

        const image = fs.existsSync(pathFile);
        if (!image) return res.status(404).send({ message: 'Image not found' });
        return res.sendFile(path.resolve(pathFile));
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}


exports.getImages = async (req, res) => {
    try {
        const directoryPath = './uploads/img';
        const user = await Forum.find()
        const files = await fs.promises.readdir(directoryPath);
        res.status(200).send({message: files, user: user});

        const fileName = req.params.fileName;
        const img = await Forum.find();
        let pathFile = []
        for (let i of img) {
            pathFile = './' + i.image;
            await Forum.find({image: })

        }
        console.log(pathFile)
        return res.sendFile(path.resolve(pathFile));

        const image = fs.existsSync(pathFile);
        if (!image) return res.status(404).send({ message: 'Images not found' });
        return res.sendFile(path.resolve(pathFile));
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}*/