const { fetchCategories } = require("../Models/categoriesModels");

exports.getCategories = (req, res, next) => {
  fetchCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};
