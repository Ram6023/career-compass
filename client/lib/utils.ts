import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    // Dynamically import pdfjs-dist to avoid bundling it if not used
    const pdfjs = await import('pdfjs-dist/build/pdf');

    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.4.449/build/pdf.worker.min.mjs`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer });

    let text = '';
    for (let i = 1; i <= Math.min(pdf.numPages, 5); i++) { // Limit to first 5 pages
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      text += textContent.items.map((item: any) => item.str).join(' ') + ' ';
    }

    return text.trim();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};
