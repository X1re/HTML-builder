const { join, extname } = require("path");
const fs = require("fs");
const { stdout } = require("process");

const folder = join(__dirname, "secret-folder");
fs.readdir(folder, { withFileTypes: true }, (err, files) => {
  if (err) {
    throw err;
  }
  files.forEach(file => {
    if (file.isFile()) {
      fs.stat(`${folder}/${file.name}`, (err, stats) => {
        if (err) {
          throw err;
        }
        stdout.write(
          `${file.name.split(".")[0]} - ${extname(file.name).slice(1)} - ${
            stats.size / 1000
          }kb\n`
        );
      });
    }
  });
});
