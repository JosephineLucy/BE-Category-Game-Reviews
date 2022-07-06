const { fetchCategories }= require('../models/categoriesModels');

exports.getCategories = (req, res, next)=>{
    fetchCategories().then((theCategories)=>{
       res.status(200).send({categories: theCategories})
    })
};



