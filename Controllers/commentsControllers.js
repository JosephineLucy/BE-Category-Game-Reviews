const { fetchCommentsByID } = require("../models/commentsModels");

exports.getCommentsByID = (req, res, next) => {
  const { review_id } = req.params;
  fetchCommentsByID(review_id)
    .then((comments) => {
      console.log({ comments }, "<<<{comments}");
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
