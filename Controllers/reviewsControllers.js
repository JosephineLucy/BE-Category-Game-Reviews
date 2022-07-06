const { fetchReviews, updateReview }= require('../models/reviewsModels');

exports.getReviews = (req, res, next)=>{
    const {review_id} = req.params;
    fetchReviews(review_id)
      .then((review) => {
        console.log({review})
        res.status(200).send({ review });
      })
      .catch((err) => {
        next(err);
      });
};


exports.patchReviews = (req, res, next) =>{
    const {review_id} = req.params;
    const { inc_votes } = req.body;
    
    if(typeof inc_votes !== 'number'){
        res.status(400).send({msg: 'Invalid vote increase, please enter a number to increase votes by'})
    };
    
    updateReview(review_id, inc_votes).then((updatedReview)=>{
        res.status(202).send({updated_review: updatedReview})
    }).catch((err) => {
        next(err);
    });
    
}