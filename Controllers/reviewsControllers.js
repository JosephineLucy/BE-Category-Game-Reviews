const {
  fetchReviewsByID,
  updateReview,
  fetchReviews,
} = require("../Models/reviewsModels");

exports.getReviewsByID = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewsByID(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchReviews = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;

  if (typeof inc_votes !== "number") {
    res.status(400).send({
      msg: "Invalid vote increase, please enter a number to increase votes by",
    });
  }

  updateReview(review_id, inc_votes)
    .then((updatedReview) => {
      res.status(202).send({ updated_review: updatedReview });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (req, res, next) => {
  const { sort_by, order, category } = req.query;
  fetchReviews(sort_by, order, category)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};
