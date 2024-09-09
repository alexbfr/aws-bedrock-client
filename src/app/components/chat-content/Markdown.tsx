import ReactMarkdown from "react-markdown";
import { CodeProps } from "react-markdown/lib/ast-to-react";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism";
import { ContextMenuActions } from "../../../context-menu/ContextMenuActions.tsx";
import { useCallback } from "react";

export function Markdown({ text }: { text: string }) {
  const handleCopyCode = useCallback(async (code: string) => {
    await navigator.clipboard.writeText(code);
  }, []);

  return (
    <ReactMarkdown
      components={{
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        code({ inline, className, children, style: _, ...props }: CodeProps) {
          const match = /language-(\w+)/.exec(className || "");
          let code = "";
          if (
            className &&
            (typeof children === "string" ||
              (Array.isArray(children) && typeof children[0] === "string"))
          ) {
            code = String(children).replace(/\n$/, "");
          }

          return !inline && match ? (
            <ContextMenuActions
              actions={{
                copyCode: {
                  disabled: !code || code === "",
                  action: () => handleCopyCode(code),
                  actionDescription: `Copy ${match[1]} code`,
                },
              }}
            >
              <SyntaxHighlighter
                PreTag="div"
                customStyle={{
                  margin: "0 5px 0 5px",
                  border: "1px solid black",
                }}
                language={match[1]}
                showLineNumbers
                {...props}
              >
                {code}
              </SyntaxHighlighter>
            </ContextMenuActions>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
