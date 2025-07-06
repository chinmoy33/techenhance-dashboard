const fs = require("fs");
const csv = require("csvtojson");

const filePath = "C:\\Users\\chinm\\Downloads\\personal_dataset 1.csv"

csv()
  .fromFile(filePath)
  .then((jsonObj) => {
    fs.writeFileSync("Personal.json", JSON.stringify(jsonObj, null, 2));
    console.log("✅ CSV converted to JSON!");
  });
