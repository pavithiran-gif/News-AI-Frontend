import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { queryAPI } from '@/services/api';
import type { TrendingTopic } from '@/types';
import { TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';

export function TrendingTopics() {
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(7);
  const [topN, setTopN] = useState(10);

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
              className="hover:shadow-md transition-shadow border-l-4"
              style={{ borderLeftColor: index < 3 ? 'hsl(var(--primary))' : 'hsl(var(--border))' }}
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
    </div>
  );
}
