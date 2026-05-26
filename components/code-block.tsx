"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

export function CodeBlock({ code, language = "bash", filename, className }: Props) {
  const [copied, setCopied] = useState(false);
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { codeToHtml } = await import("shiki");
      const result = await codeToHtml(code, {
        lang: language,
        theme: "github-dark-default",
      });
      if (!cancelled) setHtml(result);
    })();
    return () => {
      cancelled = true;
    };
  }, [code, language]);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={cn("group relative overflow-hidden rounded-xl border border-ink-200/60 bg-ink-950 dark:border-ink-800", className)}>
      {filename && (
        <div className="flex items-center justify-between border-b border-ink-800 bg-ink-900 px-4 py-2 text-xs font-mono text-ink-400">
          <span>{filename}</span>
          <span className="text-ink-500">{language}</span>
        </div>
      )}
      <button
        onClick={copy}
        aria-label="Copy code"
        className="absolute right-3 top-3 z-10 grid size-8 place-items-center rounded-md border border-ink-700/60 bg-ink-900/80 text-ink-300 opacity-0 backdrop-blur transition group-hover:opacity-100 hover:text-white"
      >
        {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-3.5" />}
      </button>
      {html ? (
        <div
          className="overflow-x-auto p-4 text-sm [&_pre]:!bg-transparent [&_code]:font-mono"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="overflow-x-auto p-4 text-sm font-mono text-ink-100">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
