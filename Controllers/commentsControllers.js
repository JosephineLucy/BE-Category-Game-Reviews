const {
  fetchCommentsByID,
  insertReviews,
} = require("../models/commentsModels");

exports.getCommentsByID = (req, res, next) => {
  const { review_id } = req.params;
  fetchCommentsByID(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentsByID = (req, res, next) => {
  const { review_id } = req.params;
  const { username } = req.body;
  const { body } = req.body;

  insertReviews(review_id, username, body)
    .then((postedComment) => {
      res.status(201).send({ postedComment });
    })
    .catch((err) => {
      next(err);
    });
};
