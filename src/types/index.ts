// Article Types
export interface Article {
  id: number;
  title: string;
  description: string;
  content: string;
  url: string;
  image_url?: string;
  published_at: string;
  source_name: string;
  category_name: string;
  author?: string;
  sentiment_score?: number;
  created_at: string;
}

export interface ArticleWithSimilarity extends Article {
  similarity?: number;
}

// API Response Types
export interface ArticlesResponse {
  success: boolean;
  count: number;
  articles: Article[];
}

export interface ArticleResponse {
  success: boolean;
  article: Article;
}

// Query Types
export interface QueryRequest {
  question: string;
  provider?: 'groq' | 'google';
  topK?: number;
  threshold?: number;
}

export interface QueryResponse {
  success: boolean;
  answer: string;
  articles: ArticleWithSimilarity[];
  provider: string;
}

// Summarize Types
export interface SummarizeRequest {
  category?: string;
  timeframe?: 'today' | 'week' | 'month';
  provider?: 'groq' | 'google';
}

export interface SummarizeResponse {
  success: boolean;
  summary: string;
  articleCount: number;
  articles: Article[];
}

// Trending Topics Types
export interface TrendingTopic {
  topic: string;
  total_articles: number;
  avg_trend_score: number;
}

export interface TrendingResponse {
  success: boolean;
  count: number;
  topics: TrendingTopic[];
}

// Statistics Types
export interface Statistics {
  totalArticles: number;
  articlesByCategory: Array<{
    category_name: string;
    article_count: number;
  }>;
  articlesBySource: Array<{
    source_name: string;
    article_count: number;
  }>;
  recentArticles: number;
  oldestArticle?: string;
  newestArticle?: string;
}

export interface StatisticsResponse {
  success: boolean;
  statistics: Statistics;
}

// News Collection Types
export interface CollectionRequest {
  topics?: string[];
}

export interface CollectionResponse {
  success: boolean;
  message: string;
  stats?: {
    totalArticles: number;
    newArticles: number;
    sources: string[];
  };
}

export interface CollectionStatus {
  isCollecting: boolean;
}

// Filters and Query Params
export interface ArticleFilters {
  category?: string;
  search?: string;
  limit?: number;
  fromDate?: string;
  toDate?: string;
}

// Example Queries
export interface ExampleQuery {
  category: string;
  queries: string[];
}

export interface ExamplesResponse {
  success: boolean;
  examples: ExampleQuery[];
}

// Error Response
export interface ErrorResponse {
  error: string;
  message?: string;
}

// UI State Types
export type ViewMode = 'feed' | 'search' | 'trending' | 'stats';

export interface AppState {
  currentView: ViewMode;
  filters: ArticleFilters;
  isLoading: boolean;
  error: string | null;
}
