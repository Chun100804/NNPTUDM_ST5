var express = require('express');
var router = express.Router();
let categoryModel = require('../schemas/category')

router.get('/', async function(req, res, next) {
  let categories = await categoryModel.find({})
  res.send({
    success: true,
    data:categories
  });
});

router.get('/:id', async function(req, res, next) {
  try {
    let item = await categoryModel.findById(req.params.id);
    res.send({
      success: true,
      data:item
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      data:error
    })
  }
});

router.post('/', async function(req,res,next){
  try {
    let newItem = new categoryModel({
      name: req.body.name
    })
    await newItem.save()
    res.send({
      success: true,
      data:newItem
    })
  } catch (error) {
    res.status(404).send({
      success: false,
      data:error
    })
  }
})

router.put('/:id', async function(req,res,next){
  let updatedItem = await categoryModel.findByIdAndUpdate(
    req.params.id,
    {
      name:req.body.name
    },{
      new:true
    }
  )
  res.send({
      success: true,
      data:updatedItem
    })
})

router.delete('/:id', async function(req,res,next){
  try {
    let updatedItem = await categoryModel.findByIdAndUpdate(
      req.params.id,
      { isDelete: true },
      { new: true }
    );
    res.send({
      success: true,
      data: updatedItem
    })
  } catch (error) {
    res.status(404).send({
      success: false,
      data: error
    })
  }
})

module.exports = router;


