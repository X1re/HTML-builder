const { createReadStream, createWriteStream } = require("fs");
const fs = require("fs/promises");
const { join, extname } = require("path");

const targetFolder = join(__dirname, "project-dist");
const stylesFolder = join(__dirname, "styles");
const output = createWriteStream(join(targetFolder, "bundle.css"));

async function buildStyles() {
  try {
    const files = await fs.readdir(stylesFolder);

    for (let file of files) {
      const stats = await fs.stat(join(stylesFolder, file));
      if (extname(file) === ".css" && stats.isFile()) {
        const input = createReadStream(join(stylesFolder, file), "utf-8");
        input.on("data", data => output.write(data));
      }
    }
  } catch (err) {
    console.error("Styles couldn't be builded");
    console.error(err);
  } finally {
    console.log("Styles have been built!");
  }
}
buildStyles();
