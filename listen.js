const app = require("./app");

const PORT = 9090  = process.env.PORT || 5432;

app.listen(PORT, () => {
  
  console.log(`Listening on ${PORT}...`);
});
