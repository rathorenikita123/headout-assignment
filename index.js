import express from "express";
import { existsSync, mkdirSync, createReadStream } from "fs";
import { join } from "path";

const app = express();
const PORT = 3000;

const dataFolderPath = join(__dirname, "tmp", "data");

if (!existsSync(dataFolderPath)) {
  mkdirSync(dataFolderPath, { recursive: true });
}

app.get("/data", (req, res) => {
  const { n, m } = req.query;

  if (n) {
    const filePath = join(dataFolderPath, `${n}.txt`);

    if (m) {
      readSpecificLine(filePath, parseInt(m), res);
    } else {
      readEntireFile(filePath, res);
    }
  } else {
    res.status(400).send('Bad Request: Parameter "n" is required.');
  }
});

function readSpecificLine(filePath, lineNumber, res) {
  const stream = createReadStream(filePath);

  let currentLineNumber = 1;
  let content = "";

  stream.on("data", (chunk) => {
    content += chunk.toString();

    const lines = content.split("\n");

    while (lines.length > 1) {
      if (currentLineNumber === lineNumber) {
        res.status(200).send(lines[0]);
        stream.destroy();
        return;
      }

      lines.shift();
      currentLineNumber++;
    }

    content = lines[0];
  });

  stream.on("end", () => {
    res.status(404).send("Line not found");
  });

  stream.on("error", (err) => {
    res.status(500).send(`Internal Server Error: ${err.message}`);
  });
}

function readEntireFile(filePath, res) {
  const stream = createReadStream(filePath);

  stream.on("open", () => {
    res.status(200);
    stream.pipe(res);
  });

  stream.on("error", (err) => {
    res.status(500).send(`Internal Server Error: ${err.message}`);
  });
}

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
