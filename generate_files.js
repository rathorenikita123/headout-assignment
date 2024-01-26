import { existsSync, mkdirSync, createWriteStream } from "fs";
import { join } from "path";
import { Readable } from "stream";

const dataFolderPath = join(__dirname, "tmp", "data");
const numberOfFiles = 50;
const fileSizeInMB = 100;
const charactersPerLine = 50;

if (!existsSync(dataFolderPath)) {
  mkdirSync(dataFolderPath, { recursive: true });
}

for (let i = 1; i <= numberOfFiles; i++) {
  const filePath = join(dataFolderPath, `${i}.txt`);

  const writeStream = createWriteStream(filePath);

  const contentStream = generateRandomContentStream(
    fileSizeInMB,
    charactersPerLine
  );

  contentStream.pipe(writeStream);

  writeStream.on("finish", () => {
    console.log(`File ${i}.txt created at ${filePath}`);
  });
}

function generateRandomContentStream(sizeInMB, charactersPerLine) {
  const fileSizeInBytes = sizeInMB * 1024 * 1024;
  const randomStream = new Readable({
    read(size) {
      const chunkSize = Math.min(size, fileSizeInBytes);
      const randomBuffer = Buffer.alloc(chunkSize);
      for (let i = 0; i < chunkSize; i++) {
        randomBuffer.writeUInt8(Math.floor(Math.random() * 256), i);
      }
      const contentWithNewLines = randomBuffer
        .toString("base64")
        .match(new RegExp(`.{1,${charactersPerLine}}`, "g"))
        .join("\n");
      this.push(contentWithNewLines);
      if (chunkSize === 0) {
        this.push(null);
      }
    },
  });
  return randomStream;
}
