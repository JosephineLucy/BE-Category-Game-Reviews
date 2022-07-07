const db = require("../db/connection");

exports.fetchCommentsByID = (review_id) => {
  return db
    .query(
      `
        SELECT * FROM reviews
        WHERE reviews.review_id = $1
         ;`,
      [review_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "no review found with the input id, sorry!",
        });
      } else return review_id;
    })
    .then((review_id) => {
      return db.query(
        ` SELECT * FROM comments
        WHERE comments.review_id = $1
         ;`,
        [review_id]
      );
    })
    .then((comments) => {
      return comments.rows;
    });
};
