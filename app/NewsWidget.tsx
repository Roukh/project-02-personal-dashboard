'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Bookmark } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

  useEffect(() => {
    const fetchNews = async () => {
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
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setError('Failed to load news. Please try again later.');
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

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
        <CardTitle>Top Headlines</CardTitle>
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
