import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { queryAPI, articleAPI } from '@/services/api';
import type { TrendingTopic, Article } from '@/types';
import { TrendingUp, AlertCircle, RefreshCw, Newspaper, Calendar, User, ExternalLink } from 'lucide-react';

// List item component for displaying articles in the dialog
function ArticleListItem({ article }: { article: Article }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 hover:border-primary/30 transition-colors group"
    >
      {/* Thumbnail */}
      {article.image_url ? (
        <img
          src={article.image_url}
          alt=""
          className="w-16 h-16 object-cover rounded flex-shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <div className="w-16 h-16 bg-muted rounded flex-shrink-0 flex items-center justify-center">
          <Newspaper className="h-6 w-6 text-muted-foreground/50" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h4>
        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(article.published_at)}
          </span>
          {article.author && (
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span className="truncate max-w-[100px]">{article.author}</span>
            </span>
          )}
          <Badge variant="outline" className="text-xs">
            {article.source_name}
          </Badge>
        </div>
      </div>

      {/* External link icon */}
      <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  );
}

export function TrendingTopics() {
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(7);
  const [topN, setTopN] = useState(10);

  // State for topic articles dialog
  const [selectedTopic, setSelectedTopic] = useState<TrendingTopic | null>(null);
  const [topicArticles, setTopicArticles] = useState<Article[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const [articlesError, setArticlesError] = useState<string | null>(null);

  const fetchTrendingTopics = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await queryAPI.getTrending(days, topN);
      setTopics(response.topics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trending topics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingTopics();
  }, []);

  const handleRefresh = () => {
    fetchTrendingTopics();
  };

  const handleTopicClick = async (topic: TrendingTopic) => {
    setSelectedTopic(topic);
    setIsLoadingArticles(true);
    setArticlesError(null);
    setTopicArticles([]);

    try {
      const response = await articleAPI.getArticles({
        search: topic.topic,
        limit: 50,
      });
      setTopicArticles(response.articles);
    } catch (err) {
      setArticlesError(err instanceof Error ? err.message : 'Failed to fetch articles');
    } finally {
      setIsLoadingArticles(false);
    }
  };

  const handleCloseDialog = () => {
    setSelectedTopic(null);
    setTopicArticles([]);
    setArticlesError(null);
  };

  const getTopicRank = (index: number) => {
    const ranks = ['🥇', '🥈', '🥉'];
    return ranks[index] || `#${index + 1}`;
  };

  const getTrendScore = (score: number) => {
    return (score * 100).toFixed(1);
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.6) return 'bg-blue-500';
    if (score >= 0.4) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Trending Topics
              </CardTitle>
              <CardDescription>
                Discover what's making headlines based on article volume and engagement
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={days.toString()} onValueChange={(val) => setDays(Number(val))}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Last 24 hours</SelectItem>
                  <SelectItem value="3">Last 3 days</SelectItem>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
              <Select value={topN.toString()} onValueChange={(val) => setTopN(Number(val))}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">Top 5</SelectItem>
                  <SelectItem value="10">Top 10</SelectItem>
                  <SelectItem value="20">Top 20</SelectItem>
                  <SelectItem value="50">Top 50</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleRefresh} variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Trending Topics List */}
      {!isLoading && !error && topics.length > 0 && (
        <div className="space-y-3">
          {topics.map((topic, index) => (
            <Card
              key={topic.topic}
              className="hover:shadow-md transition-shadow border-l-4 cursor-pointer hover:bg-muted/50"
              style={{ borderLeftColor: index < 3 ? 'hsl(var(--primary))' : 'hsl(var(--border))' }}
              onClick={() => handleTopicClick(topic)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {/* Rank Badge */}
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-muted text-2xl">
                    {getTopicRank(index)}
                  </div>

                  {/* Topic Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold capitalize">{topic.topic}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Badge variant="secondary">{topic.total_articles} articles</Badge>
                      </span>
                      <span className="flex items-center gap-2">
                        Trend Score:
                        <Badge variant="outline">{getTrendScore(topic.avg_trend_score)}%</Badge>
                      </span>
                    </div>
                  </div>

                  {/* Visual Trend Indicator */}
                  <div className="hidden sm:flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getScoreColor(topic.avg_trend_score)} transition-all`}
                        style={{ width: `${topic.avg_trend_score * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && topics.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No trending topics found for the selected period.</p>
          </CardContent>
        </Card>
      )}

      {/* Topic Articles Dialog */}
      <Dialog open={!!selectedTopic} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="capitalize">{selectedTopic?.topic}</span>
            </DialogTitle>
            <DialogDescription>
              {selectedTopic && (
                <span className="flex items-center gap-3">
                  <Badge variant="secondary">{selectedTopic.total_articles} total articles</Badge>
                  <Badge variant="outline">Trend Score: {(selectedTopic.avg_trend_score * 100).toFixed(1)}%</Badge>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-2 mt-4">
            {/* Loading State */}
            {isLoadingArticles && (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Skeleton className="h-4 w-4 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {articlesError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{articlesError}</AlertDescription>
              </Alert>
            )}

            {/* Articles List */}
            {!isLoadingArticles && !articlesError && topicArticles.length > 0 && (
              <div className="space-y-2">
                {topicArticles.map((article) => (
                  <ArticleListItem key={article.id} article={article} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoadingArticles && !articlesError && topicArticles.length === 0 && (
              <div className="text-center py-12">
                <Newspaper className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No articles found for this topic.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
