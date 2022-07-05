const { fetchCategories, fetchReviews }= require('../models/categoriesModels');

exports.getCategories = (req, res, next)=>{
    fetchCategories().then((theCategories)=>{
       res.status(200).send({categories: theCategories})
    })
};

exports.getReviews = (req, res, next)=>{
    const {review_id} = req.params;
    fetchReviews(review_id)
      .then((review) => {
        res.status(200).send({ review });
      })
      .catch((err) => {
        next(err);
      });
};


