'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, Star, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

const STOCK_SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'NVDA', 'TSLA'];

// Helper function to add delay between API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function StocksWidget() {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStocks = useCallback(async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_STOCKS_API;
        if (!apiKey) {
          setError('Alpha Vantage API key not configured');
          setLoading(false);
          return;
        }

        // Check if we have cached data (less than 5 minutes old)
        const cachedData = localStorage.getItem('stocksCache');
        const cachedTime = localStorage.getItem('stocksCacheTime');

        if (cachedData && cachedTime) {
          const age = Date.now() - parseInt(cachedTime);
          if (age < 5 * 60 * 1000) { // 5 minutes
            setStocks(JSON.parse(cachedData));
            setLoading(false);
            return;
          }
        }

        // Fetch stock data sequentially with delays to avoid rate limits
        const stockData: StockData[] = [];

        for (let i = 0; i < STOCK_SYMBOLS.length; i++) {
          const symbol = STOCK_SYMBOLS[i];

          try {
            const response = await fetch(
              `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
            );

            if (!response.ok) {
              console.warn(`Failed to fetch ${symbol}`);
              continue;
            }

            const data = await response.json();
            const quote = data['Global Quote'];

            if (!quote || Object.keys(quote).length === 0) {
              console.warn(`No data for ${symbol} - possible rate limit`);
              continue;
            }

            stockData.push({
              symbol: quote['01. symbol'] || symbol,
              price: parseFloat(quote['05. price']) || 0,
              change: parseFloat(quote['09. change']) || 0,
              changePercent: parseFloat(quote['10. change percent']?.replace('%', '')) || 0,
            });

            // Add delay between requests (Alpha Vantage free tier: 5 calls/min)
            if (i < STOCK_SYMBOLS.length - 1) {
              await delay(13000); // 13 seconds between calls = ~4.6 calls/min
            }
          } catch (err) {
            console.warn(`Error fetching ${symbol}:`, err);
          }
        }

        if (stockData.length === 0) {
          setError('No stock data available. Please check your API key or try again later.');
        } else {
          setStocks(stockData);
          // Cache the results
          localStorage.setItem('stocksCache', JSON.stringify(stockData));
          localStorage.setItem('stocksCacheTime', Date.now().toString());
          setLastUpdated(new Date());
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching stocks:', error);
        setError('Failed to load stock data. Please try again later.');
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    fetchStocks();

    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchStocks();
    }, 5 * 60 * 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [fetchStocks]);

  const handleManualRefresh = () => {
    // Clear cache on manual refresh to get fresh data
    localStorage.removeItem('stocksCache');
    localStorage.removeItem('stocksCacheTime');
    fetchStocks();
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

  const toggleFavorite = (symbol: string) => {
    setFavorites((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Stock Market</CardTitle>
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
              title="Refresh stock data"
            >
              <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading && <p className="text-center text-muted-foreground">Loading stocks...</p>}

        {error && <p className="text-center text-destructive">{error}</p>}

        {!loading && !error && stocks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {stocks.map((stock) => (
              <div
                key={stock.symbol}
                className="relative p-4 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-colors"
              >
                <button
                  onClick={() => toggleFavorite(stock.symbol)}
                  className="absolute top-2 right-2 p-1 hover:bg-accent rounded"
                >
                  <Star
                    className={`size-4 ${
                      favorites.includes(stock.symbol)
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>

                <div className="space-y-2">
                  <Badge variant="secondary" className="text-xs">
                    {stock.symbol}
                  </Badge>
                  <p className="text-2xl">${stock.price.toFixed(2)}</p>
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      stock.change >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {stock.change >= 0 ? (
                      <TrendingUp className="size-4" />
                    ) : (
                      <TrendingDown className="size-4" />
                    )}
                    <span>
                      {stock.change >= 0 ? '+' : ''}
                      {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && stocks.length === 0 && (
          <p className="text-center text-muted-foreground">No stock data available</p>
        )}
      </CardContent>
    </Card>
  );
}
