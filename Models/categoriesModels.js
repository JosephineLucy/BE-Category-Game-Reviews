const db = require('../db/connection');


exports.fetchCategories = ()=>{
    return db.query(`
         SELECT * FROM categories 
    `).then((result)=>{
        console.log(result.rows)
        return result.rows
    })
};

exports.fetchReviews = (review_id)=>{
    return db.query(
        `
        SELECT *
        FROM reviews
        WHERE review_id = $1`,
        [review_id]
        ).then((result) =>{
            if (result.rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: 'no review found with the input id, sorry!',
                });
            }
            console.log(result)
          return result.rows[0];

      }

      )
}