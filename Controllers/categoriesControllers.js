const fetchCategories= require('../models/categoriesModels');

function getCategories(req, res){
    fetchCategories().then((theCategories)=>{
       res.status(200).send({categories: theCategories})
    })
};

module.exports = getCategories

