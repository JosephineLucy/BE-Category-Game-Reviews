const db = require("../db/connection");
const { sort } = require("../db/data/test-data/users");

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

exports.fetchReviews = (sort_by = "created_at", order = "DESC", category) => {
  const validCategories = [
    "strategy",
    "hidden-roles",
    "dexterity",
    "push-your-luck",
    "roll-and-write",
    "deck-building",
    "engine-building",
  ];

  const validColumns = [
    "title",
    "designer",
    "owner",
    "review_body",
    "category",
    "created_at",
    "votes",
    "review_img_url",
    "comment_count",
  ];
  const validOrder = ["ASC", "DESC"];

  if (category) {
    if (!validCategories.includes(category)) {
      return Promise.reject({
        status: 400,
        msg: "sorry, this category does not exist! Please try a different category to filter by.",
      });
    }
  }

  if (!validColumns.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: "sorry, this column does not exist! Please try a different column to sort by.",
    });
  }

  if (!validOrder.includes(order.toUpperCase())) {
    return Promise.reject({
      status: 400,
      msg: "sorry, invalid order specified! Valid orders are ASC and DESC.",
    });
  }

  if (category) {
    return db
      .query(
        `
      SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count
      FROM reviews
      LEFT JOIN comments ON comments.review_id = reviews.review_id
      WHERE reviews.category = $1
      GROUP BY reviews.review_id
      ORDER BY ${sort_by} ${order}
      `,
        [category]
      )
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: "sorry, no reviews found for this category",
          });
        }

        return result.rows;
      });
  } else
    return db
      .query(
        `
    SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count
    FROM reviews
    LEFT JOIN comments ON comments.review_id = reviews.review_id
    GROUP BY reviews.review_id
    ORDER BY ${sort_by} ${order}
    ;`
      )
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: "sorry, no reviews found",
          });
        }
        return result.rows;
      });
};

/*
 */
