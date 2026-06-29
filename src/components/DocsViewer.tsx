import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DOCS, type DocEntry } from "../lib/docs";

function TableOfContents({ doc }: { doc: DocEntry }) {
  const headings = doc.content
    .split("\n")
    .filter((l) => l.startsWith("##") && !l.startsWith("###"))
    .map((l) => l.replace(/^##\s*/, "").trim());

  if (headings.length === 0) return null;

  return (
    <details className="mb-4 pixel-card-sm p-2">
      <summary className="font-pixel text-[0.6rem] cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
        📖 On this page
      </summary>
      <nav className="mt-2 flex flex-col gap-1">
        {headings.map((h) => (
          <a
            key={h}
            href={`#${h.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`}
            className="font-pixel text-[0.55rem] text-muted-foreground hover:text-foreground transition-colors pl-2 border-l-2 border-transparent hover:border-current"
          >
            {h}
          </a>
        ))}
      </nav>
    </details>
  );
}

export function DocsViewer() {
  const [activeId, setActiveId] = useState(DOCS[0].id);
  const active = DOCS.find((d) => d.id === activeId) ?? DOCS[0];

  return (
    <div className="pixel-card p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-3xl leading-none">📖 Library</h2>
          <p className="font-pixel text-[0.65rem] text-muted-foreground mt-1">
            Guides, lore & documentation for every system.
          </p>
        </div>
      </div>

      {/* Nav tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {DOCS.map((doc) => (
          <button
            key={doc.id}
            onClick={() => setActiveId(doc.id)}
            className={`font-pixel text-[0.6rem] px-3 py-1.5 rounded-md border transition-all ${
              activeId === doc.id
                ? "border-[var(--color-primary)] text-foreground bg-[var(--color-primary)]/10"
                : "border-[var(--color-border)] text-muted-foreground hover:text-foreground hover:border-[var(--color-primary)]"
            }`}
          >
            {doc.emoji} {doc.title}
          </button>
        ))}
      </div>

      {/* Content */}
      <TableOfContents doc={active} />
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children, ...props }) => (
              <h1 className="font-display text-2xl leading-tight mt-0 mb-4" {...props}>
                {children}
              </h1>
            ),
            h2: ({ children, ...props }) => {
              const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
              return (
                <h2 id={id} className="font-display text-xl leading-tight mt-6 mb-3" {...props}>
                  {children}
                </h2>
              );
            },
            h3: ({ children, ...props }) => (
              <h3 className="font-display text-lg leading-tight mt-5 mb-2" {...props}>
                {children}
              </h3>
            ),
            p: ({ children, ...props }) => (
              <p className="font-pixel text-[0.65rem] leading-relaxed my-2" {...props}>
                {children}
              </p>
            ),
            ul: ({ children, ...props }) => (
              <ul className="font-pixel text-[0.65rem] leading-relaxed my-2 pl-4 space-y-1" {...props}>
                {children}
              </ul>
            ),
            ol: ({ children, ...props }) => (
              <ol className="font-pixel text-[0.65rem] leading-relaxed my-2 pl-4 space-y-1" {...props}>
                {children}
              </ol>
            ),
            li: ({ children, ...props }) => (
              <li className="text-muted-foreground" {...props}>
                {children}
              </li>
            ),
            code: ({ children, ...props }) => {
              const isBlock = String(children).includes("\n");
              if (isBlock) {
                return (
                  <pre className="pixel-card-sm p-3 my-3 overflow-x-auto font-pixel text-[0.6rem] leading-relaxed">
                    <code {...props}>{children}</code>
                  </pre>
                );
              }
              return (
                <code
                  className="px-1 py-0.5 rounded text-[0.6rem]"
                  style={{ background: "color-mix(in oklab, var(--color-muted) 60%, transparent)" }}
                  {...props}
                >
                  {children}
                </code>
              );
            },
            pre: ({ children }) => <>{children}</>,
            table: ({ children }) => (
              <div className="overflow-x-auto my-3">
                <table className="w-full text-[0.65rem] font-pixel pixel-card-sm" style={{ borderCollapse: "collapse" }}>
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="px-3 py-2 text-left font-semibold border-b border-[var(--color-border)]">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-3 py-1.5 border-b border-[var(--color-border)] text-muted-foreground">
                {children}
              </td>
            ),
            hr: () => <hr className="my-6 border-[var(--color-border)]" />,
            strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
            em: ({ children }) => <em className="italic text-muted-foreground">{children}</em>,
            a: ({ href, children }) => (
              <a href={href} className="text-[var(--color-primary)] underline hover:no-underline">
                {children}
              </a>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-[var(--color-primary)] pl-3 my-2 italic pixel-card-sm p-2">
                {children}
              </blockquote>
            ),
          }}
        >
          {active.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
