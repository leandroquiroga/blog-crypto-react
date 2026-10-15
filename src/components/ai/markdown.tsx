import { memo } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

const components: Components = {
  h1: ({ className, ...props }) => (
    <h2 className={cn('mt-4 font-display text-base font-semibold', className)} {...props} />
  ),
  h2: ({ className, ...props }) => (
    <h3 className={cn('mt-4 font-display text-base font-semibold', className)} {...props} />
  ),
  h3: ({ className, ...props }) => (
    <h4 className={cn('mt-3 text-sm font-semibold', className)} {...props} />
  ),
  p: ({ className, ...props }) => (
    <p className={cn('text-sm leading-relaxed text-foreground/90', className)} {...props} />
  ),
  ul: ({ className, ...props }) => (
    <ul className={cn('list-disc space-y-1 pl-5 text-sm', className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn('list-decimal space-y-1 pl-5 text-sm', className)} {...props} />
  ),
  li: ({ className, ...props }) => <li className={cn('leading-relaxed', className)} {...props} />,
  strong: ({ className, ...props }) => (
    <strong className={cn('font-semibold text-foreground', className)} {...props} />
  ),
  a: ({ className, ...props }) => (
    <a
      className={cn('text-primary underline underline-offset-2', className)}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  code: ({ className, ...props }) => (
    <code className={cn('rounded bg-muted px-1 py-0.5 font-mono text-xs', className)} {...props} />
  ),
};

interface MarkdownProps {
  content: string;
  className?: string;
}

export const Markdown = memo(function Markdown({ content, className }: MarkdownProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});
