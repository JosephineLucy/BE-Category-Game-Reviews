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

exports.insertReviews = (review_id, username, body) => {
  const params = [review_id, username, body];
  return db
    .query(
      `
        SELECT FROM users
        WHERE users.username = $1
        ;`,
      [params[1]]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 400,
          msg: "sorry, invalid username!",
        });
      } else return params;
    })
    .then((params) => {
      return db
        .query(
          `INSERT INTO comments (review_id, author, body)
                VALUES ($1, $2, $3)        
                RETURNING *;`,
          params
        )
        .then((result) => {
          return result.rows[0];
        });
    });
};
