const { createWriteStream, createReadStream } = require("fs");
const fs = require("fs/promises");
const { join } = require("path");
const copyDir = require("../04-copy-directory");
const buildStyles = require("../05-merge-styles");

const targetFolder = join(__dirname, "project-dist");
const componentsDir = join(__dirname, "components");
const stylesFolder = join(__dirname, "styles");
const assetsFolder = join(__dirname, "assets");

function streamFile(directory, filename) {
  const content = createReadStream(join(directory, filename), "utf-8");
  return content;
}

async function saveStreamToVariable(stream) {
  return new Promise((res, rej) => {
    let data = "";
    stream.on("data", chunk => (data += chunk));
    stream.on("error", err => rej(err));
    stream.on("end", () => res(data));
  });
}

async function buildProject() {
  try {
    const components = await fs.readdir(componentsDir);
    const template = streamFile(__dirname, "template.html");
    let html = await saveStreamToVariable(template);
    const placeholders = html.match(/{{\w+}}/g);

    for (const placeholder of placeholders) {
      const filename = placeholder.slice(2, -2);
      if (components.includes(`${filename}.html`)) {
        const component = streamFile(componentsDir, `${filename}.html`);
        const componentToStr = await saveStreamToVariable(component);
        html = html.replace(placeholder, componentToStr);
      }
    }

    await fs.mkdir(targetFolder, { recursive: true });
    const output = createWriteStream(join(targetFolder, "index.html"));

    output.write(html);
    buildStyles(targetFolder, stylesFolder, "style.css");
    const assetsFolderCheck = await fs.readdir(join(__dirname, "assets"));

    for (const asset of assetsFolderCheck) {
      const stats = await fs.stat(join(assetsFolder, asset));
      if (stats.isDirectory) {
        copyDir(join(assetsFolder, asset), join(targetFolder, "assets", asset));
      } else {
        copyDir(assetsFolder, targetFolder);
      }
    }
    console.log("Project have been builded!");
  } catch (err) {
    console.error("Project couldn't be built");
    console.error(err);
  }
}
buildProject();
