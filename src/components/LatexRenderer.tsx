import React, { useEffect, useState } from "react";

interface LatexRendererProps {
  math: string;
  block?: boolean;
}

export const LatexRenderer: React.FC<LatexRendererProps> = ({ math, block = false }) => {
  const [html, setHtml] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const renderMath = () => {
      const katexObj = (window as any).katex;
      if (katexObj) {
        try {
          const rendered = katexObj.renderToString(math, {
            displayMode: block,
            throwOnError: false,
          });
          setHtml(rendered);
          setError(false);
        } catch (e) {
          console.warn("KaTeX render error:", e);
          setError(true);
        }
      } else {
        setError(true);
      }
    };

    // Render immediately if available, otherwise listen or try repeatedly for up to a few seconds
    renderMath();

    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if ((window as any).katex) {
        renderMath();
        clearInterval(interval);
      } else if (attempts > 20) {
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [math, block]);

  if (error || !html) {
    // Elegant fallback typing for math symbols when CDN is loading
    return (
      <span className={`font-mono text-cyan-400 bg-slate-900/60 px-1.5 py-0.5 rounded border border-slate-700/60 my-0.5 ${block ? "block text-center py-2 translate-y-0" : "inline-block"}`}>
        {math}
      </span>
    );
  }

  return (
    <span
      className={block ? "block my-3 text-center overflow-x-auto p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 scrollbar-thin" : "inline-block px-1"}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
