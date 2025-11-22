import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { newsAPI } from '@/services/api';
import { Download, Loader2, CheckCircle2, XCircle } from 'lucide-react';

export function NewsCollector() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  const [topics, setTopics] = useState('');
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    stats?: { totalArticles: number; newArticles: number; sources: string[] };
  } | null>(null);

  const handleCollect = async () => {
    setIsCollecting(true);
    setResult(null);

    try {
      const topicList = topics
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const response = await newsAPI.collect(topicList.length > 0 ? topicList : undefined);
      setResult(response);
    } catch (err) {
      setResult({
        success: false,
        message: err instanceof Error ? err.message : 'Collection failed',
      });
    } finally {
      setIsCollecting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setResult(null);
    setTopics('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Collect News</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Collect News Articles
          </DialogTitle>
          <DialogDescription>
            Trigger manual news collection from NewsAPI and The Guardian. Leave topics empty to collect default news.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Topics (optional, comma-separated)
            </label>
            <Input
              placeholder="technology, sports, business"
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              disabled={isCollecting}
            />
          </div>

          {/* Result Display */}
          {result && (
            <Card className={result.success ? 'border-green-500/50' : 'border-red-500/50'}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {result.success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{result.message}</p>
                    {result.stats && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="secondary">
                          {result.stats.newArticles} new articles
                        </Badge>
                        <Badge variant="outline">
                          {result.stats.totalArticles} total
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleCollect} disabled={isCollecting}>
              {isCollecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Collecting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Collect
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
