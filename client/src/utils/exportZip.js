import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * Export the generated website as a clean ZIP package containing index.html and a README
 */
export async function downloadZip(htmlContent, projectName = 'my-generated-website') {
  if (!htmlContent) return;

  const zip = new JSZip();

  // Add the standalone HTML file
  zip.file('index.html', htmlContent);

  // Add a helpful README.md
  const readmeContent = `# ${projectName}

Generated with **Prompt2Web AI** (Hackathon MVP)

## How to Run
1. Double-click \`index.html\` to view the website in any web browser.
2. The website is completely self-contained with embedded responsive CSS (via Tailwind CDN) and interactive JavaScript.

## How to Deploy
- **Vercel / Netlify / GitHub Pages**: Simply upload this directory or drag-and-drop the \`index.html\` file to deploy instantly worldwide for free!

---
*Created using Prompt2Web AI*
`;
  zip.file('README.md', readmeContent);

  // Generate ZIP blob and trigger download
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `${projectName}.zip`);
}

/**
 * Directly download single index.html file
 */
export function downloadHtml(htmlContent, filename = 'index.html') {
  if (!htmlContent) return;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  saveAs(blob, filename);
}

/**
 * Open the HTML in a new browser tab using blob URL
 */
export function openInNewTab(htmlContent) {
  if (!htmlContent) return;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}
