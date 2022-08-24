'use strict'

const Product = require('../models/products');
const Cart = require('../models/shoppingCart');

exports.addToCart = async (req, res) => {
    try {
        const productId = req.params.product;
        const product = await Product.findOne({ _id: productId }).populate('company');
        const price = parseInt(product.price)
        let subT = 0
        const exist = await Cart.findOne({ user: req.user.sub, product: product._id })
        if (exist) {
            subT = parseInt(exist.subtotal) + price
            const data = {
                subtotal: subT,
                times: parseInt(exist.times) + 1
            }
            const updateCart = await Cart.findOneAndUpdate({ _id: exist._id }, data, { new: true });
            if (!updateCart) return res.status(500).send({ message: 'Error updating the cart' });
            return res.send({ message: 'Cart updated' })
        } else {
            subT = product.price
            const data = {
                user: req.user.sub,
                product: product._id,
                subtotal: subT,
                times: 1
            }
            const createCart = new Cart(data);
            await createCart.save();
            return res.send({ message: 'Cart created' })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}

exports.quitToCart = async (req, res) => {
    try {
        const productId = req.params.product;
        const product = await Product.findOne({ _id: productId }).populate('company');
        const price = parseInt(product.price)
        let subT = 0
        const exist = await Cart.findOne({ user: req.user.sub, product: product._id })
        if (!exist) return res.status(500).send({ message: 'Your cart is empty' });
        let times = parseInt(exist.times)
        if (exist) {
            if (exist.times > 1) {
                subT = parseInt(exist.subtotal) - parseInt(product.price)
                times = times - 1
                const data = {
                    subtotal: subT,
                    times: times
                }
                const updateCart = await Cart.findOneAndUpdate({ _id: exist._id }, data, { new: true });
                if (!updateCart) return res.status(500).send({ message: 'Error deleting a product in the cart' });
                return res.send({ message: 'Product deleted' })
            } else if (exist.times == 1) {
                const deleteCart = await Cart.findByIdAndDelete({ _id: exist._id });
                if (!deleteCart) return res.status(500).send({ message: 'Error deleting a product in the cart' });
                return res.send({ message: 'Product deleted, the cart has no products' });
            }
        } else {
            return res.status(400).send({ message: 'There are no any products in your cart' });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}

exports.getCart = async (req, res) => {
    try {
        const userId = req.user.sub;
        const cart = await Cart.find({ user: userId })
            .populate({ path: 'user', select: '-password -phone -role -_id' })
            .populate({ path: 'product', select: '-date -_id', populate: 'company' });
        if (!cart) return res.status(404).send({ message: 'Your cart does not exist' });
        let total = 0;
        for (let t of cart) {
            total += t.subtotal
        }

        return res.send({ message: 'Cart:', cart, total })
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}


exports.pay = async (req, res) => {
    try {
        const userId = req.user.sub;
        const exist = await Cart.findOne({user: userId});
        const cart = await Cart.find({ user: userId })
            .populate({ path: 'user', select: '-password -phone -role -_id' })
            .populate({ path: 'product', select: '-date -_id', populate: 'company' });
        if (!exist) return res.status(404).send({ message: 'Your cart does not exist' });
        let total = 0;
        for (let t of cart) {
            total += t.subtotal
        }
        for (let i of cart) {
            await Cart.findOneAndDelete({ _id: i._id });
        }
        return res.send({ message: 'Cart found:', cart, total, thanks: 'Thanks for your parchase' });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}