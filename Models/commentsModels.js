const db = require("../db/connection");

exports.fetchCommentsByID = (review_id) => {
  return db
    .query(
      `
        SELECT * FROM comments
        WHERE comments.review_id = $1
         ;`,
      [review_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "no comments found for the input id, sorry! Try a different review_id",
        });
      }
      return result.rows[0];
    });
};
