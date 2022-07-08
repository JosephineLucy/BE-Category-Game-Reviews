const {
  fetchCommentsByID,
  insertReviews,
  removeCommentsByID,
} = require("../Models/commentsModels");

exports.getCommentsByID = (req, res, next) => {
  const { review_id } = req.params;
  fetchCommentsByID(review_id)
    .then((comments) => {
      console.log({ comments });
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
  if (
    req.body === undefined ||
    req.body === {} ||
    Object.keys(req.body).length < 2
  ) {
    res.status(400).send({ msg: "Bad Request" });
  }
  insertReviews(review_id, username, body)
    .then((postedComment) => {
      res.status(201).send({ postedComment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentsByID = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentsByID(comment_id)
    .then((result) => {
      res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};
