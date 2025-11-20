'use client';

import { useState, useEffect, useCallback } from 'react';
import { ExternalLink, Bookmark, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  source: string;
  publishedAt: string;
  category: string;
}

export function NewsWidget() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchNews = useCallback(async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_NEWS_API;
        if (!apiKey) {
          setError('News API key not found');
          setLoading(false);
          return;
        }

        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=${apiKey}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }

        const data = await response.json();

        const articles: NewsArticle[] = data.articles.map((article: any, index: number) => ({
          id: String(index + 1),
          title: article.title || 'No title',
          description: article.description || 'No description available',
          url: article.url || '#',
          imageUrl: article.urlToImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
          source: article.source?.name || 'Unknown',
          publishedAt: article.publishedAt || new Date().toISOString(),
          category: 'News',
        }));

        setNews(articles);
        setLastUpdated(new Date());
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setError('Failed to load news. Please try again later.');
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    fetchNews();

    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchNews();
    }, 5 * 60 * 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [fetchNews]);

  const handleManualRefresh = () => {
    fetchNews();
  };

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return '';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    return date.toLocaleTimeString();
  };

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const getTimeAgo = (dateString: string) => {
    const now = Date.now();
    const then = new Date(dateString).getTime();
    const diff = now - then;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Top Headlines</CardTitle>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-xs text-muted-foreground">
                {formatLastUpdated(lastUpdated)}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleManualRefresh}
              disabled={loading}
              title="Refresh news"
            >
              <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading && <p className="text-center text-muted-foreground">Loading news...</p>}

        {error && <p className="text-center text-destructive">{error}</p>}

        {!loading && !error && news.length > 0 && (
          <div className="space-y-4">
            {news.map((article) => (
              <div
                key={article.id}
                className="flex gap-4 p-3 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-colors group"
              >
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 hover:text-primary transition-colors"
                    >
                      <h4 className="line-clamp-2">{article.title}</h4>
                    </a>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {article.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {article.category}
                    </Badge>
                    <span>{article.source}</span>
                    <span>•</span>
                    <span>{getTimeAgo(article.publishedAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && news.length === 0 && (
          <p className="text-center text-muted-foreground">No news available</p>
        )}
      </CardContent>
    </Card>
  );
}
