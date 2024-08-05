import { PDFDocument, PDFName, PDFDict, PDFRawStream, PDFRef } from "pdf-lib";
import fs from "fs";
import path from "path";
import pdf from "pdf-parse";

// Define the structure of the table entry
interface TableEntry {
  number: string;
  description: string;
  model: string;
  material: string;
  note: string;
}

// Function to parse the PDF and extract the images
async function extractImagesFromPDF(pdfPath: string): Promise<void> {
  try {
    // Load the PDF document
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Extract text from the PDF
    const data = await pdf(pdfBytes);
    const text = data.text;

    // Log extracted text for debugging
    console.log("Extracted text:", text);

    // Parse the text to extract table entries
    const table = parseTableEntries(text);

    // Log parsed table entries for debugging
    console.log("Parsed table entries:", table);

    // Create the images directory if it doesn't exist
    const imagesDir = path.join(__dirname, "images");
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir);
    }

    // Iterate through each page of the PDF
    let imageCount = 0;
    for (let i = 0; i < pdfDoc.getPageCount(); i++) {
      const page = pdfDoc.getPage(i);
      const resources = page.node.get(PDFName.of("Resources")) as PDFDict;
      const xObject = resources?.get(PDFName.of("XObject")) as PDFDict;

      if (xObject) {
        const imageKeys = xObject.keys();
        for (let j = 0; j < imageKeys.length; j++) {
          const imageKey = imageKeys[j];
          const imageRef = xObject.get(imageKey) as PDFRef;
          const image = pdfDoc.context.lookup(imageRef) as PDFRawStream;

          if (image) {
            const imageBytes = image.contents;
            const tableEntry = table[imageCount];

            if (tableEntry) {
              const imageName = `${tableEntry.number}.webp`;

              // Save the image
              fs.writeFileSync(path.join(imagesDir, imageName), imageBytes);
              console.log(`Saved image: ${imageName}`);
            } else {
              console.warn(
                `No table entry found for image at page ${i + 1}, index ${j}`
              );
            }

            imageCount++;
          }
        }
      }
    }

    console.log("Images extracted and saved successfully.");
  } catch (error) {
    console.error("Error extracting images:", error);
  }
}

// Function to parse the table entries from the text content
function parseTableEntries(text: string): TableEntry[] {
  const table: TableEntry[] = [];
  const lines = text.split("\n");
  let currentEntry: Partial<TableEntry> = {};
  let inDescription = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith("OKING-SU-A9-")) {
      if (currentEntry.number) {
        table.push(currentEntry as TableEntry);
      }
      currentEntry = {
        number: line,
        description: "",
        model: "",
        material: "",
        note: "",
      };
      inDescription = true;
    } else if (inDescription) {
      if (line.startsWith("For Toyota GR Supra")) {
        currentEntry.model = line;
        inDescription = false;
      } else {
        currentEntry.description +=
          (currentEntry.description ? " " : "") + line;
      }
    } else if (
      line.startsWith("Carbon Fiber") ||
      line.startsWith("Forged Carbon Fiber") ||
      line.startsWith("ABS") ||
      line.startsWith("Dry Carbon Fiber")
    ) {
      currentEntry.material = line;
    } else if (line.startsWith("US$")) {
      currentEntry.note = line;
    }
  }

  if (currentEntry.number) {
    table.push(currentEntry as TableEntry);
  }

  return table;
}

// Example usage
const pdfPath = "./Wholesale Price List For Supra -OKING.pdf";

extractImagesFromPDF(pdfPath)
  .then(() => console.log("Images extracted and saved successfully."))
  .catch((err) => console.error("Error extracting images:", err));
