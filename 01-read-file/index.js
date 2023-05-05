// const { readStream } = require("fs");
const fs = require("fs");
const { join } = require("path");
const { stdout } = require("process");

const textFile = join(__dirname, "text.txt");
const stream = fs.createReadStream(textFile, "utf-8");

let data = "";
stream.on("data", chunk => (data += chunk));
stream.on("data", () => stdout.write(data));
stream.on("error", err => stdout.write(`Error: ${err.message}`));
