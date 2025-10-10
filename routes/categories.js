var express = require('express');
var router = express.Router();
let { Response } = require('../utils/responseHandler')
let { Authentication, Authorization } = require('../utils/authHandler')
let Category = require('../schemas/categories')

// View: USER, MOD, ADMIN
router.get('/', Authentication, Authorization("ADMIN","MOD","USER"), async function(req, res, next) {
  let categories = await Category.find({ isDeleted: false });
  Response(res,200,true,categories)
});

router.get('/:id', Authentication, Authorization("ADMIN","MOD","USER"), async function(req, res, next) {
  try {
    let category = await Category.findById(req.params.id);
    if(!category || category.isDeleted){
      return Response(res,404,false,"Category not found")
    }
    Response(res,200,true,category)
  } catch (error) {
    Response(res,404,false,error)
  }
});

// Create + Update: MOD, ADMIN
router.post('/', Authentication, Authorization("ADMIN","MOD"), async function(req, res, next) {
  let newCategory = new Category({
    name: req.body.name,
    description: req.body.description
  })
  await newCategory.save();
  Response(res,201,true,newCategory)
});

router.put('/:id', Authentication, Authorization("ADMIN","MOD"), async function(req, res, next) {
  let category = await Category.findById(req.params.id);
  if(!category || category.isDeleted){
    return Response(res,404,false,"Category not found")
  }
  category.name = req.body.name ?? category.name;
  category.description = req.body.description ?? category.description;
  await category.save();
  Response(res,200,true,category)
});

// Delete: ADMIN
router.delete('/:id', Authentication, Authorization("ADMIN"), async function(req, res, next) {
  let category = await Category.findById(req.params.id);
  if(!category || category.isDeleted){
    return Response(res,404,false,"Category not found")
  }
  category.isDeleted = true;
  await category.save();
  Response(res,200,true,category)
});

module.exports = router;

