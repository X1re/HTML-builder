const { createReadStream, createWriteStream } = require("fs");
const fs = require("fs/promises");
const { join, extname } = require("path");

async function buildStyles(outputFolder, stylesFolderToBuild, cssFilename) {
  const output = createWriteStream(join(outputFolder, cssFilename));
  try {
    const files = await fs.readdir(stylesFolderToBuild);

    for (let file of files) {
      const stats = await fs.stat(join(stylesFolderToBuild, file));
      if (extname(file) === ".css" && stats.isFile()) {
        const input = createReadStream(
          join(stylesFolderToBuild, file),
          "utf-8"
        );
        input.on("error", err => console.log(err));
        input.on("data", data => output.write(data));
      }
    }
  } catch (err) {
    console.error("Styles couldn't be built");
    console.error(err);
  } finally {
    console.log("Styles have been built!");
  }
}

if (require.main === module) {
  const targetFolder = join(__dirname, "project-dist");
  const stylesFolder = join(__dirname, "styles");
  buildStyles(targetFolder, stylesFolder, "bundle.css");
}

module.exports = buildStyles;
