'use client';

import { WeatherCard } from './WeatherCard';
import { CalendarWidget } from './CalendarWidget';
import { TaskList } from './TaskList';
import { ForecastCard } from './ForecastCard';
import { StocksWidget } from './StocksWidget';
import { NewsWidget } from './NewsWidget';
import { ThemeToggle } from '@/components/theme-toggle';

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl">Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Top Row - Weather and Stocks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeatherCard />
          <StocksWidget />
        </div>

        {/* Forecast */}
        <ForecastCard />

        {/* Middle Row - Calendar and Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CalendarWidget />
          <TaskList />
        </div>

        {/* News Section */}
        <NewsWidget />
      </main>
    </div>
  );
}