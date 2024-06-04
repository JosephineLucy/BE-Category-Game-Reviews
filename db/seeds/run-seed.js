const devData = require('../data/development-data/index.js'); //brings in all the data from the files in development data
const seed = require('./seed.js'); //brings in seed function
const db = require('../connection.js'); // brings in connection to database

const runSeed = () => {
  return seed(devData).then(() => db.end());
};

runSeed();
