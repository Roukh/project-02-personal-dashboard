'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Event {
  date: Date;
  title: string;
  type: 'meeting' | 'reminder' | 'task';
}

export function CalendarWidget() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events] = useState<Event[]>([]);

  const selectedDateEvents = events.filter(
    (event) =>
      date &&
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
  );

  const getEventTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-500';
      case 'reminder':
        return 'bg-amber-500';
      case 'task':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-lg border mx-auto"
          modifiers={{
            hasEvent: events.map((e) => e.date),
          }}
          modifiersClassNames={{
            hasEvent: 'bg-primary/20 font-bold',
          }}
        />

        {selectedDateEvents.length > 0 && (
          <div className="pt-4 border-t space-y-2">
            <p className="text-sm text-muted-foreground">
              Events on {date?.toLocaleDateString()}
            </p>
            {selectedDateEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 rounded-lg bg-muted"
              >
                <div className={`size-2 rounded-full ${getEventTypeColor(event.type)}`} />
                <span className="text-sm">{event.title}</span>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {event.type}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
