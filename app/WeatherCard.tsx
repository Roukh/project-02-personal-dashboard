'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Wind, Droplets, Thermometer } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

export function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState('Bethesda');
  const [inputCity, setInputCity] = useState('');

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_OPEN_WEATHER_MAP_API;
      if (!apiKey) {
        setError('Weather API key not found');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setError('City not found. Please try another city.');
        } else {
          setError('Failed to fetch weather data. Please try again.');
        }
        setWeather(null);
        setLoading(false);
        return;
      }

      const data: WeatherData = await response.json();
      setWeather(data);
      setError(null);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setError('Failed to load weather data. Please try again later.');
      setWeather(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCity.trim()) {
      setCity(inputCity.trim());
      setInputCity('');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Current Weather</CardTitle>
        <form onSubmit={handleSearch} className="flex gap-2 mt-4">
          <Input
            type="text"
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            placeholder="Search city..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Search className="size-4" />
          </Button>
        </form>
      </CardHeader>

      <CardContent>
        {loading && <p className="text-center text-muted-foreground">Loading weather data...</p>}

        {error && <p className="text-center text-destructive">Error: {error}</p>}

        {weather && !loading && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <MapPin className="size-4" />
                  <span>{weather.name}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl">{Math.round(weather.main.temp)}°</span>
                  <span className="text-muted-foreground">C</span>
                </div>
                <p className="text-muted-foreground capitalize mt-1">
                  {weather.weather[0].description}
                </p>
              </div>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                alt={weather.weather[0].description}
                className="size-24"
              />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="flex flex-col items-center gap-2">
                <Thermometer className="size-5 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Feels Like</p>
                  <p>{Math.round(weather.main.feels_like)}°C</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Droplets className="size-5 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Humidity</p>
                  <p>{weather.main.humidity}%</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Wind className="size-5 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Wind Speed</p>
                  <p>{weather.wind.speed} m/s</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}