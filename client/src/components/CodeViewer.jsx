import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, ExternalLink } from 'lucide-react';
import { downloadHtml, openInNewTab } from '../utils/exportZip';

export default function CodeViewer({ htmlContent }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!htmlContent) return;
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = (htmlContent || '').split('\n');
  const totalLines = lines.length;
  const totalChars = (htmlContent || '').length;

  return (
    <div className="h-full flex flex-col bg-slate-950 font-mono text-xs overflow-hidden select-text">
      {/* Code Viewer Toolbar */}
      <div className="h-11 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between text-slate-400 select-none shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <FileCode className="w-4 h-4 text-violet-400" />
            <span>index.html</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-[11px] text-slate-500">
            {totalLines} lines • {(totalChars / 1024).toFixed(1)} KB
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors border border-slate-700"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => downloadHtml(htmlContent, 'index.html')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors border border-slate-700"
            title="Download index.html directly"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save File</span>
          </button>
        </div>
      </div>

      {/* Code Editor Body with Line Numbers */}
      <div className="flex-1 overflow-auto p-4 leading-relaxed font-mono text-[13px] text-slate-300">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, index) => (
              <tr key={index} className="hover:bg-slate-900/60 group">
                <td className="w-12 pr-4 text-right text-slate-600 select-none group-hover:text-slate-400 align-top">
                  {index + 1}
                </td>
                <td className="whitespace-pre font-mono text-slate-200 break-all select-text">
                  {line}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
