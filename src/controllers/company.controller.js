'use strict'

const Company = require('../models/company');
const Product = require('../models/products');
const { validateData } = require("../utils/validate");

exports.createCompany = async (req, res) => {
    try {
        const params = req.body;
        const data = {
            name: params.name,
            address: params.address,
            phone: params.phone,
            email: params.email,
            description: params.description
        }
        const msg = validateData(data);
        if (msg) return res.status(400).send(msg);
        const already = await Company.findOne({ name: params.name });
        if (already) return res.status(400).send({ message: 'Company already exist' });
        const company = new Company(data);
        await company.save();
        return res.send({ message: 'Company saved' });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}

exports.getCompanies = async (req, res) => {
    try {
        const companies = await Company.find({}).sort({ name: 1 });
        if (!companies) return res.status(404).send({ message: 'There are no any companies here' });
        return res.send({ message: 'Companies found:', companies })
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}

exports.getCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findOne({ _id: companyId });
        if (!company) return res.status(404).send({ message: 'Company not found' });
        return res.send({ message: 'Company found:', exist: company })
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}

exports.updateCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        const params = req.body;
        const company = await Company.findOne({ _id: companyId });
        if (!company) return res.status(404).send({ message: 'Company not found' });
        if (company.name == params.name) {
            const update = await Company.findByIdAndUpdate({ _id: companyId }, params, { new: true });
            if (!update) return res.status(500).send({ message: 'Cannot update this company' });
            return res.send({ message: 'Company updated' });
        }else return res.status(404).send({ message: 'Company already exist' });


    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}

exports.deleteCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findOne({ _id: companyId });
        if (!company) return res.status(404).send({ message: 'Company not found' });
        const deleteC = await Company.findOneAndDelete({ _id: companyId });
        if (!deleteC) return res.status(500).send({ message: 'Cannot delete this company' });
        const products = await Product.find({ company: companyId });
        for (let p of products) {
            await Product.findOneAndDelete({ _id: p._id });
        }
        return res.send({ message: 'Company deleted' });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}