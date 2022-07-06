const db = require("../db/connection");

exports.fetchReviewsByID = (review_id) => {
  return db
    .query(
      `
        SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count
        FROM reviews
        LEFT JOIN comments ON comments.review_id = reviews.review_id
        WHERE reviews.review_id = $1
        GROUP BY reviews.review_id
        ;`,
      [review_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "no review found with the input id, sorry!",
        });
      }
      return result.rows[0];
    });
};

exports.updateReview = (review_id, inc_votes) => {
  const params = [review_id, inc_votes];

  return db
    .query(
      `UPDATE reviews 
        SET votes = votes + $2
        WHERE review_id = $1
        RETURNING *`,
      params
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "no review found with the input id, sorry!",
        });
      }
      return result.rows[0];
    });
};

exports.fetchReviews = () => {
  return db
    .query(
      `
    SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count
    FROM reviews
    LEFT JOIN comments ON comments.review_id = reviews.review_id
    GROUP BY reviews.review_id
    ORDER BY created_at
    ;`
    )
    .then((result) => {
      return result.rows;
    });
};
