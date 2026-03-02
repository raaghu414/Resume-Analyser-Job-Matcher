const fs = require('fs');
const pdfParse = require('pdf-parse');

async function parsePDF(filePath) {
  const data = await fs.promises.readFile(filePath);
  const parsed = await pdfParse(data);
  // pdf-parse returns text in parsed.text
  return parsed.text || '';
}

module.exports = { parsePDF };
