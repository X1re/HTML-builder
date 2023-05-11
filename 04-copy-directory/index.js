const { join } = require("path");
const fs = require("fs/promises");

async function copyDir(copyFrom, copyWhere) {
  try {
    await fs.rm(copyWhere, { recursive: true, force: true });
    await fs.mkdir(copyWhere, { recursive: true });
    const files = await fs.readdir(copyFrom);
    files.forEach(file => {
      fs.copyFile(`${copyFrom}\\${file}`, `${copyWhere}\\${file}`);
    });
    console.log("Files copied!");
  } catch {
    console.error("Files couldn't be copied");
  }
}
if (require.main === module) {
  const folder = join(__dirname, "files");
  const output = join(__dirname, "files-copy");
  copyDir(folder, output);
}

module.exports = copyDir;
