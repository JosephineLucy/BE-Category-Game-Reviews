const fetchCategories= require('../models/categoriesModels');

function getCategories(req, res){
    fetchCategories().then((theCategories)=>{
        console.log({categories: theCategories}, '<<<<<line 5')
       res.status(200).send({categories: theCategories})
    })
};

module.exports = getCategories

