export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "txt") {
    return await file.text();
  }

  if (extension === "pdf") {
    return await extractFromPDF(file);
  }

  if (extension === "docx") {
    return await extractFromDocx(file);
  }

  if (extension === "doc") {
    throw new Error("Old .doc format is not supported. Please save as .docx or .pdf instead.");
  }

  throw new Error("Unsupported file type. Please upload .txt, .pdf, or .docx");
}

async function extractFromPDF(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    fullText += pageText + "\n";
  }

  return fullText.trim();
}

async function extractFromDocx(file: File): Promise<string> {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
}