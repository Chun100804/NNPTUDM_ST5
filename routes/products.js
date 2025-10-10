var express = require('express');
var router = express.Router();
let { Response } = require('../utils/responseHandler')
let { Authentication, Authorization } = require('../utils/authHandler')
let Product = require('../schemas/products')

// View: USER, MOD, ADMIN
router.get('/', Authentication, Authorization("ADMIN","MOD","USER"), async function(req, res, next) {
  let products = await Product.find({ isDeleted: false }).populate({
    path: 'category',
    select: 'name'
  });
  Response(res,200,true,products)
});

router.get('/:id', Authentication, Authorization("ADMIN","MOD","USER"), async function(req, res, next) {
  try {
    let product = await Product.findById(req.params.id).populate({
      path: 'category',
      select: 'name'
    });
    if(!product || product.isDeleted){
      return Response(res,404,false,"Product not found")
    }
    Response(res,200,true,product)
  } catch (error) {
    Response(res,404,false,error)
  }
});

// Create + Update: MOD, ADMIN
router.post('/', Authentication, Authorization("ADMIN","MOD"), async function(req, res, next) {
  let newProduct = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    stock: req.body.stock
  })
  await newProduct.save();
  Response(res,201,true,newProduct)
});

router.put('/:id', Authentication, Authorization("ADMIN","MOD"), async function(req, res, next) {
  let product = await Product.findById(req.params.id);
  if(!product || product.isDeleted){
    return Response(res,404,false,"Product not found")
  }
  product.name = req.body.name ?? product.name;
  product.description = req.body.description ?? product.description;
  product.price = req.body.price ?? product.price;
  product.category = req.body.category ?? product.category;
  product.stock = req.body.stock ?? product.stock;
  await product.save();
  Response(res,200,true,product)
});

// Delete: ADMIN
router.delete('/:id', Authentication, Authorization("ADMIN"), async function(req, res, next) {
  let product = await Product.findById(req.params.id);
  if(!product || product.isDeleted){
    return Response(res,404,false,"Product not found")
  }
  product.isDeleted = true;
  await product.save();
  Response(res,200,true,product)
});

module.exports = router;

