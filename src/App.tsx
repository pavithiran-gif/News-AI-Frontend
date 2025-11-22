import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewsFeed } from "@/components/NewsFeed";
import { AISearch } from "@/components/AISearch";
import { TrendingTopics } from "@/components/TrendingTopics";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggleButton } from "@/components/ThemeToggle";
import { NewsCollector } from "@/components/NewsCollector";
import { Newspaper, Sparkles, TrendingUp } from "lucide-react";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="news-assistant-theme">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo & Title */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                  <Newspaper className="relative h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">News Assistant</h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    AI-Powered News Discovery & Analysis
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <NewsCollector />
                <ThemeToggleButton />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <Tabs defaultValue="feed" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
              <TabsTrigger value="feed" className="flex items-center gap-2">
                <Newspaper className="h-4 w-4" />
                <span className="hidden sm:inline">News Feed</span>
                <span className="sm:hidden">Feed</span>
              </TabsTrigger>
              <TabsTrigger value="search" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">AI Search</span>
                <span className="sm:hidden">Search</span>
              </TabsTrigger>
              <TabsTrigger value="trending" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Trending</span>
                <span className="sm:hidden">Trends</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="feed" className="space-y-6 animate-in fade-in-50 duration-500">
              <NewsFeed />
            </TabsContent>

            <TabsContent value="search" className="space-y-6 animate-in fade-in-50 duration-500">
              <AISearch />
            </TabsContent>

            <TabsContent value="trending" className="space-y-6 animate-in fade-in-50 duration-500">
              <TrendingTopics />
            </TabsContent>
          </Tabs>
        </main>

        {/* Footer */}
        <footer className="border-t bg-muted/30 mt-12">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            <p>Powered by RAG-based semantic search with Groq & Google AI</p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
