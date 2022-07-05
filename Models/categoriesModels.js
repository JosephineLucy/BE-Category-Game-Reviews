const db = require('../db/connection');


function fetchCategories (){
    return db.query(`
         SELECT * FROM categories 
    `).then((result)=>{
        console.log(result.rows)
        return result.rows
    })
};

module.exports = fetchCategories;
