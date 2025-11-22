import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Article, ArticleWithSimilarity } from "@/types";
import { Calendar, ExternalLink, User, Newspaper, X } from "lucide-react";

interface ArticleCardProps {
  article: Article | ArticleWithSimilarity;
  showSimilarity?: boolean;
}

export function ArticleCard({
  article,
  showSimilarity = false,
}: ArticleCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getSentimentColor = (score?: number) => {
    if (!score) return "secondary";
    if (score > 0.1) return "default";
    if (score < -0.1) return "destructive";
    return "secondary";
  };

  const getSentimentLabel = (score?: number) => {
    if (!score) return "Neutral";
    if (score > 0.1) return "Positive";
    if (score < -0.1) return "Negative";
    return "Neutral";
  };

  const similarity = (article as ArticleWithSimilarity).similarity;

  return (
    <>
      <Card
        className="group flex flex-col h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/30 overflow-hidden cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        {/* Image with overlay */}
        <div className="relative w-full h-48 overflow-hidden bg-muted">
        {article.image_url ? (
          <>
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <Newspaper className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}

        {/* Floating badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          <Badge className="bg-background/90 backdrop-blur-sm text-foreground border-0 shadow-sm">
            {article.category_name}
          </Badge>
          {showSimilarity && similarity !== undefined && (
            <Badge className="bg-primary/90 backdrop-blur-sm text-primary-foreground border-0 shadow-sm">
              {(similarity * 100).toFixed(0)}% match
            </Badge>
          )}
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-2 text-lg leading-tight group-hover:text-primary transition-colors">
          {article.title}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-sm">
          {article.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pt-0">
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(article.published_at)}</span>
          </div>
          {article.author && (
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              <span className="truncate max-w-[120px]">{article.author}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-3">
          <Badge variant="secondary" className="text-xs font-normal">
            {article.source_name}
          </Badge>
          {article.sentiment_score !== undefined &&
            article.sentiment_score !== null && (
              <Badge
                variant={getSentimentColor(article.sentiment_score)}
                className="text-xs font-normal"
              >
                {getSentimentLabel(article.sentiment_score)}
              </Badge>
            )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          asChild
          variant="ghost"
          className="w-full justify-between hover:bg-primary/10 hover:text-primary group/btn"
          onClick={(e) => e.stopPropagation()}
        >
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            <span>Read full article</span>
            <ExternalLink className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </a>
        </Button>
      </CardFooter>
    </Card>

      {/* Expanded Article Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge>{article.category_name}</Badge>
                  {showSimilarity && similarity !== undefined && (
                    <Badge variant="secondary">
                      {(similarity * 100).toFixed(0)}% match
                    </Badge>
                  )}
                  {article.sentiment_score !== undefined &&
                    article.sentiment_score !== null && (
                      <Badge variant={getSentimentColor(article.sentiment_score)}>
                        {getSentimentLabel(article.sentiment_score)}
                      </Badge>
                    )}
                </div>
                <DialogTitle className="text-xl leading-tight">
                  {article.title}
                </DialogTitle>
                <DialogDescription className="mt-2">
                  {article.description}
                </DialogDescription>
              </div>
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(article.published_at)}</span>
              </div>
              {article.author && (
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  <span>{article.author}</span>
                </div>
              )}
              <Badge variant="outline">{article.source_name}</Badge>
            </div>
          </DialogHeader>

          {/* Article Image */}
          {article.image_url && (
            <div className="relative w-full h-48 overflow-hidden rounded-lg bg-muted my-4 flex-shrink-0">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}

          {/* Full Article Content */}
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {article.content ? (
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {article.content}
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  Full content not available. Click the button below to read the article on the source website.
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="flex-shrink-0 mt-4">
            <Button
              asChild
              className="w-full sm:w-auto"
            >
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <span>Read on source</span>
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
