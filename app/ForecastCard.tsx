'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, CloudRain, Sun, Wind, CloudSnow, CloudDrizzle } from 'lucide-react';

interface ForecastDay {
  day: string;
  temp: number;
  condition: string;
  icon: string;
}

export function ForecastCard() {
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_OPEN_WEATHER_MAP_API;
        if (!apiKey) {
          setError('Weather API key not found');
          setLoading(false);
          return;
        }

        // Using a default city - you can make this dynamic later
        const city = 'Bethesda';
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch forecast data');
        }

        const data = await response.json();

        // Group forecasts by day and get one forecast per day (around noon)
        const dailyForecasts: ForecastDay[] = [];
        const processedDays = new Set<string>();

        data.list.forEach((item: any) => {
          const date = new Date(item.dt * 1000);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          const dateKey = date.toDateString();
          const hour = date.getHours();

          // Take the forecast closest to noon (12:00) for each day
          if (!processedDays.has(dateKey) && hour >= 11 && hour <= 14 && dailyForecasts.length < 5) {
            dailyForecasts.push({
              day: dayName,
              temp: Math.round(item.main.temp),
              condition: item.weather[0].main,
              icon: item.weather[0].main.toLowerCase(),
            });
            processedDays.add(dateKey);
          }
        });

        setForecast(dailyForecasts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching forecast:', error);
        setError('Failed to load forecast data');
        setLoading(false);
      }
    };

    fetchForecast();
  }, []);

  const getWeatherIcon = (icon: string) => {
    const iconClass = 'size-8 text-muted-foreground';
    const iconLower = icon.toLowerCase();

    if (iconLower.includes('clear') || iconLower.includes('sun')) {
      return <Sun className={iconClass} />;
    } else if (iconLower.includes('rain')) {
      return <CloudRain className={iconClass} />;
    } else if (iconLower.includes('drizzle')) {
      return <CloudDrizzle className={iconClass} />;
    } else if (iconLower.includes('snow')) {
      return <CloudSnow className={iconClass} />;
    } else if (iconLower.includes('cloud')) {
      return <Cloud className={iconClass} />;
    } else {
      return <Cloud className={iconClass} />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <p className="text-center text-muted-foreground">Loading forecast...</p>
        )}

        {error && (
          <p className="text-center text-destructive">{error}</p>
        )}

        {!loading && !error && forecast.length > 0 && (
          <div className="grid grid-cols-5 gap-2">
            {forecast.map((day, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <p className="text-sm text-muted-foreground">{day.day}</p>
                {getWeatherIcon(day.icon)}
                <p className="text-lg">{day.temp}°</p>
                <p className="text-xs text-muted-foreground text-center">{day.condition}</p>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && forecast.length === 0 && (
          <p className="text-center text-muted-foreground">No forecast data available</p>
        )}
      </CardContent>
    </Card>
  );
}
