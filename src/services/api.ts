import type {
  ArticlesResponse,
  ArticleResponse,
  QueryRequest,
  QueryResponse,
  SummarizeRequest,
  SummarizeResponse,
  TrendingResponse,
  StatisticsResponse,
  CollectionRequest,
  CollectionResponse,
  CollectionStatus,
  ExamplesResponse,
  ArticleFilters,
} from '@/types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper function for API calls
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred');
  }
}

// Article Endpoints
export const articleAPI = {
  // Get articles with filters
  getArticles: async (filters?: ArticleFilters): Promise<ArticlesResponse> => {
    const params = new URLSearchParams();

    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.fromDate) params.append('fromDate', filters.fromDate);
    if (filters?.toDate) params.append('toDate', filters.toDate);

    const queryString = params.toString();
    const endpoint = `/api/articles${queryString ? `?${queryString}` : ''}`;

    return fetchAPI<ArticlesResponse>(endpoint);
  },

  // Get article by ID
  getArticleById: async (id: number): Promise<ArticleResponse> => {
    return fetchAPI<ArticleResponse>(`/api/articles/${id}`);
  },

  // Search articles
  searchArticles: async (query: string, limit = 10): Promise<ArticlesResponse> => {
    const params = new URLSearchParams({ q: query, limit: limit.toString() });
    return fetchAPI<ArticlesResponse>(`/api/articles/search?${params}`);
  },

  // Get statistics
  getStatistics: async (): Promise<StatisticsResponse> => {
    return fetchAPI<StatisticsResponse>('/api/articles/stats');
  },
};

// RAG / AI Query Endpoints
export const queryAPI = {
  // Ask a question (RAG-based)
  query: async (request: QueryRequest): Promise<QueryResponse> => {
    return fetchAPI<QueryResponse>('/api/query', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  // Summarize articles
  summarize: async (request: SummarizeRequest): Promise<SummarizeResponse> => {
    return fetchAPI<SummarizeResponse>('/api/summarize', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  // Get trending topics
  getTrending: async (days = 7, topN = 10): Promise<TrendingResponse> => {
    const params = new URLSearchParams({
      days: days.toString(),
      topN: topN.toString()
    });
    return fetchAPI<TrendingResponse>(`/api/trending?${params}`);
  },

  // Get example queries
  getExamples: async (): Promise<ExamplesResponse> => {
    return fetchAPI<ExamplesResponse>('/api/examples');
  },
};

// News Collection Endpoints
export const newsAPI = {
  // Trigger manual collection
  collect: async (topics?: string[]): Promise<CollectionResponse> => {
    const request: CollectionRequest = topics ? { topics } : {};
    return fetchAPI<CollectionResponse>('/api/news/collect', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  // Get collection status
  getStatus: async (): Promise<CollectionStatus> => {
    return fetchAPI<CollectionStatus>('/api/news/status');
  },

  // Fetch specific topic
  fetchTopic: async (topic: string, source = 'all'): Promise<CollectionResponse> => {
    return fetchAPI<CollectionResponse>('/api/news/fetch-topic', {
      method: 'POST',
      body: JSON.stringify({ topic, source }),
    });
  },
};

// Health Check
export const healthAPI = {
  check: async (): Promise<{ status: string; timestamp: string; environment: string }> => {
    return fetchAPI('/health');
  },
};

// Export all APIs
export default {
  articles: articleAPI,
  query: queryAPI,
  news: newsAPI,
  health: healthAPI,
};
