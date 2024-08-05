declare module "pdf-parse" {
  interface PDFInfo {
    PDFFormatVersion: string;
    IsAcroFormPresent: boolean;
    IsXFAPresent: boolean;
    [key: string]: any;
  }

  interface PDFMetadata {
    [key: string]: any;
  }

  interface PDFText {
    text: string;
  }

  interface PDFParseOptions {
    version?: string;
  }

  interface PDFDocumentProxy {
    numPages: number;
    fingerprint: string;
  }

  interface PDFData {
    numpages: number;
    numrender: number;
    info: PDFInfo;
    metadata: PDFMetadata;
    text: string;
    version: string;
  }

  function pdf(
    dataBuffer: Buffer | Uint8Array,
    options?: PDFParseOptions
  ): Promise<PDFData>;

  export = pdf;
}
