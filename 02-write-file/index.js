const { createWriteStream } = require("fs");
const { join } = require("path");
const { stdout, stdin, exit } = require("process");

const textFile = join(__dirname, "text.txt");
const output = createWriteStream(textFile);

const sayBye = () => {
  stdout.write("Good bye!");
  exit();
};

stdout.write("Enter some text: ");
stdin.on("data", data => {
  if (data.toString().trim() === "exit") {
    sayBye();
  }
  output.write(data);
});
process.on("SIGINT", () => sayBye());
