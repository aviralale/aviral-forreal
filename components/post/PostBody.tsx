import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

/**
 * Renders post Markdown. Styling comes from the `.post-body` stylesheet in
 * globals.css; syntax highlighting tokens (rehype-highlight) are themed there
 * too, so this stays a server component with zero client JS.
 */
export function PostBody({ content }: { content: string }) {
  return (
    <div className="post-body article-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
