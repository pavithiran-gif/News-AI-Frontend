import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArticleCard } from './ArticleCard';
import { queryAPI } from '@/services/api';
import type { QueryResponse, ExampleQuery } from '@/types';
import { Search, Sparkles, AlertCircle, Loader2, Bot } from 'lucide-react';

export function AISearch() {
  const [question, setQuestion] = useState('');
  const [provider, setProvider] = useState<'groq' | 'google'>('groq');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QueryResponse | null>(null);
  const [examples, setExamples] = useState<ExampleQuery[]>([]);

  useEffect(() => {
    // Load example queries
    queryAPI.getExamples().then((response) => {
      setExamples(response.examples);
    }).catch(console.error);
  }, []);

  const handleSearch = async () => {
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await queryAPI.query({
        question: question.trim(),
        provider,
        topK: 10,
        threshold: 0.7,
      });

      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get answer');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSearch();
    }
  };

  const handleExampleClick = (exampleQuestion: string) => {
    setQuestion(exampleQuestion);
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Ask AI About News
          </CardTitle>
          <CardDescription>
            Ask natural language questions about news articles and get AI-powered answers with sources
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="What happened in technology sector this week?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="text-base"
              />
            </div>
            <div className="flex gap-2">
              <Select value={provider} onValueChange={(val) => setProvider(val as 'groq' | 'google')}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="groq">Groq AI</SelectItem>
                  <SelectItem value="google">Google AI</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Ask
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Example Queries */}
      {!result && examples.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Try these examples:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examples.map((example) => (
              <Card key={example.category} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">{example.category}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {example.queries.map((query, idx) => (
                    <Button
                      key={idx}
                      variant="ghost"
                      className="w-full justify-start text-left h-auto py-2 px-3 text-sm"
                      onClick={() => handleExampleClick(query)}
                    >
                      {query}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* AI Answer */}
      {result && (
        <div className="space-y-6">
          <Card className="border-primary/20 bg-gradient-to-br from-card to-muted/30 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <span>AI Answer</span>
                </CardTitle>
                <Badge variant="secondary" className="uppercase text-xs font-semibold">
                  {result.provider}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="prose prose-sm dark:prose-invert max-w-none
                prose-headings:font-semibold prose-headings:text-foreground
                prose-h1:text-xl prose-h1:mt-6 prose-h1:mb-3
                prose-h2:text-lg prose-h2:mt-5 prose-h2:mb-2
                prose-h3:text-base prose-h3:mt-4 prose-h3:mb-2
                prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:my-2
                prose-strong:text-foreground prose-strong:font-semibold
                prose-ul:my-3 prose-ul:space-y-1
                prose-ol:my-3 prose-ol:space-y-1
                prose-li:text-muted-foreground prose-li:pl-1
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
              ">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-xl font-bold text-foreground mt-6 mb-3 pb-2 border-b border-border">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-lg font-semibold text-foreground mt-5 mb-2">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-base font-semibold text-foreground mt-4 mb-2">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-sm text-muted-foreground leading-relaxed my-2">
                        {children}
                      </p>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-foreground bg-primary/5 px-1 rounded">
                        {children}
                      </strong>
                    ),
                    ul: ({ children }) => (
                      <ul className="my-3 ml-4 space-y-2">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="my-3 ml-4 space-y-2 list-decimal">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-sm text-muted-foreground pl-1 relative before:content-['•'] before:absolute before:-left-3 before:text-primary before:font-bold">
                        {children}
                      </li>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {children}
                      </a>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-primary/50 pl-4 my-4 italic text-muted-foreground bg-muted/30 py-2 rounded-r">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children }) => (
                      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
                        {children}
                      </code>
                    ),
                  }}
                >
                  {result.answer}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* Source Articles */}
          {result.articles && result.articles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Source Articles ({result.articles.length})
                </h3>
                <p className="text-sm text-muted-foreground">
                  Sorted by relevance
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {result.articles.map((article) => (
                  <ArticleCard key={article.id} article={article} showSimilarity />
                ))}
              </div>
            </div>
          )}

          {/* New Search Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setResult(null);
                setQuestion('');
              }}
            >
              Ask Another Question
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
