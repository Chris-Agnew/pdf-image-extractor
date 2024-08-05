# PDF Image Extractor

This project extracts images from a PDF and names them according to a table in the PDF. The images are saved using the `number` field from the table entries.

## Prerequisites

```bash
brew install pkg-config
```

```bash
brew install pixman cairo pango libpng jpeg giflib librsvg
```

Node.js (>= 12.x)
npm (>= 6.x)

## Setup

1. **Clone the repository**:

   ```sh
   git clone git@github.com:Chris-Agnew/pdf-image-extractor.git
   cd pdf-image-extractor
   ```

   ```bash
   npm install
   ```

2. **Place PDF file in root project directory**

3. **Update PDF Path in extractor.ts**
   const pdfPath = './your-pdf-file-name.pdf'

4.**Run Script**

```bash
npx ts-node extractor.ts
```
