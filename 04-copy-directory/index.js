const { join } = require("path");
const fs = require("fs/promises");

const folder = join(__dirname, "files");
const output = join(__dirname, "files-copy");

async function copyDir() {
  try {
    await fs.mkdir(output, { recursive: true });
    const files = await fs.readdir(folder);
    files.forEach(file => {
      fs.copyFile(`${folder}\\${file}`, `${output}\\${file}`);
    });
    console.log("Files copied!");
  } catch {
    console.error("Files couldn't be copied");
  }
}
copyDir();
