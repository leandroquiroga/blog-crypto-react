import { Clock, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { NewsArticle } from '@/types/news.types';
import { estimateReadingMinutes, formatDateTime, splitTags } from '@/utils/format';
import { isDefaultNewsImage } from '@/utils/news';

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const publishedAt = article.published_on * 1000;
  const readingMinutes = estimateReadingMinutes(article.body);
  const tags = splitTags(article.tags);
  const showImage = !isDefaultNewsImage(article.imageurl);
  const showSourceImage = !isDefaultNewsImage(article.source_info.img);

  return (
    <Card className={cn('h-full gap-4', showImage && 'overflow-hidden pt-0')}>
      {showImage ? (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={article.imageurl}
            alt=""
            loading="lazy"
            width={640}
            height={360}
            className="size-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      ) : null}

      <CardContent className="flex flex-1 flex-col gap-3 px-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <Badge variant="secondary" className={cn('gap-1.5', showSourceImage && 'pr-2 pl-1')}>
            {showSourceImage ? (
              <img
                src={article.source_info.img}
                alt=""
                width={16}
                height={16}
                loading="lazy"
                className="size-4 rounded-full"
              />
            ) : null}
            {article.source_info.name}
          </Badge>

          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden="true" />
            {readingMinutes} min de lectura
          </span>

          <time dateTime={new Date(publishedAt).toISOString()}>{formatDateTime(publishedAt)}</time>
        </div>

        <h3 className="line-clamp-3 font-display text-base leading-snug font-semibold">
          {article.title}
        </h3>

        <p className="line-clamp-4 text-sm text-muted-foreground">{article.body}</p>

        {tags.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5" aria-label="Etiquetas de la noticia">
            {tags.map((tag) => (
              <li key={tag}>
                <Badge variant="outline" className="text-[11px] font-normal">
                  {tag}
                </Badge>
              </li>
            ))}
          </ul>
        ) : null}
      </CardContent>

      <CardFooter className="px-5">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Leer nota completa
          <ExternalLink className="size-4" aria-hidden="true" />
        </a>
      </CardFooter>
    </Card>
  );
}
