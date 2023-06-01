const data = require("../../data/products.json");
const fs = require("fs");
const newData = data.map((d) => {
  d.coverImage = d.images[0];
  return d;
});

console.log(newData);

fs.writeFileSync("./newData.json", JSON.stringify(newData));
