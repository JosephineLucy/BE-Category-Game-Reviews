const { getCategories } = require("./Controllers/categoriesControllers");
const {
  getReviewsByID,
  patchReviews,
  getReviews,
} = require("./Controllers/reviewsControllers");
const { getUsers } = require("./Controllers/usersControllers");
const {
  getCommentsByID,
  postCommentsByID,
  deleteCommentsByID,
} = require("./Controllers/commentsControllers");
const { getEndPoints } = require("./Controllers/apiControllers");

const cors = require("cors");

const express = require("express");

const app = express();

app.use(cors());

app.use(express.json());

app.use("*", (req, res) => {
  res.status(404).send({ msg: "path does not exist, sorry!" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    console.log(err);
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
});

app.use((err, req, res) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else
    res
      .status(500)
      .send({ error_message: "Error something went wrong, sorry!!" });
});

app.get("/api", getEndPoints);
app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewsByID);
app.get("/api/reviews/:review_id/comments", getCommentsByID);
app.get("/api/users", getUsers);

app.patch("/api/reviews/:review_id", patchReviews);
app.post("/api/reviews/:review_id/comments", postCommentsByID);
app.delete("/api/comments/:comment_id", deleteCommentsByID);

module.exports = app;
