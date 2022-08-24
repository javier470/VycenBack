'use strict'

const Product = require('../models/products');
const { validateData } = require("../utils/validate");

exports.createProduct = async (req, res) => {
    try {
        const params = req.body;
        const data = {
            name: params.name,
            size: params.size,
            sex: params.sex,
            price: params.price,
            date: params.date,
            company: params.company
        }
        const msg = validateData(data);
        if (msg) return res.status(400).send(msg);
        if (params.price < 0) return res.status(400).send({ message: 'Invalid price' });

        const product = new Product(data);
        await product.save();
        return res.send({ message: 'Product saved' });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err)
    }
}

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('company').sort({date: 1});
        if (!products) return res.status(404).send({ message: 'There are no any products' });
        return res.send({ message: 'Products found:', products })
    } catch (err) {
        console.log(err);
        return res.status(500).send(err)
    }
}

exports.getProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findOne({ _id: productId }).populate('company');
        if (!product) return res.status(404).send({ message: 'Product not found' });
        return res.send({ message: 'Product found:', product });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err)
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const params = req.body;
        if(params.price < 0) return res.status(400).send({message: 'Invalid price'});
        const product = await Product.findOne({ _id: productId });
        if (!product) return res.status(404).send({ message: 'Product not found' });
        const update = await Product.findByIdAndUpdate({ _id: productId }, params, { new: true });
        if (!update) return res.status(500).send({ message: 'Cannot update this product' });
        return res.send({ message: 'Product updated' });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const productID = req.params.id;
        const product = await Product.findOne({ _id: productID });
        if (!product) return res.status(404).send({ message: 'Product not found' });
        const deleteC = await Product.findOneAndDelete({ _id: productID });
        if (!deleteC) return res.status(500).send({ message: 'Cannot delete this product' });
        return res.send({ message: 'Product deleted' });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}