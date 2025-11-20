'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Calendar, FolderOpen, List } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ClickUpTask {
  id: string;
  name: string;
  status: string;
  dueDate: string | null;
  priority: number | null;
  list: {
    id: string;
    name: string;
  };
  folder: {
    id: string;
    name: string;
  } | null;
  space: {
    id: string;
    name: string;
  } | null;
  url: string;
}

export function TaskList() {
  const [tasks, setTasks] = useState<ClickUpTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/clickup/tasks');

        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const data = await response.json();
        setTasks(data.tasks || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Failed to load tasks from ClickUp');
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const formatDueDate = (dueDate: string | null) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: 'Overdue', color: 'destructive' };
    if (diffDays === 0) return { text: 'Today', color: 'warning' };
    if (diffDays === 1) return { text: 'Tomorrow', color: 'default' };
    if (diffDays <= 7) return { text: `${diffDays} days`, color: 'default' };
    return { text: date.toLocaleDateString(), color: 'secondary' };
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('complete') || statusLower.includes('done')) return 'default';
    if (statusLower.includes('progress')) return 'default';
    return 'secondary';
  };

  const getPriorityLabel = (priority: number | null) => {
    if (priority === null) return null;
    if (priority === 1) return { text: 'Urgent', color: 'destructive' };
    if (priority === 2) return { text: 'High', color: 'warning' };
    if (priority === 3) return { text: 'Normal', color: 'default' };
    return { text: 'Low', color: 'secondary' };
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>ClickUp Tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && (
          <p className="text-center text-muted-foreground">Loading tasks...</p>
        )}

        {error && (
          <p className="text-center text-destructive">{error}</p>
        )}

        {!loading && !error && tasks.length === 0 && (
          <p className="text-center text-muted-foreground">No tasks found</p>
        )}

        {!loading && !error && tasks.length > 0 && (
          <div className="space-y-3">
            {tasks.map((task) => {
              const dueInfo = formatDueDate(task.dueDate);
              const priorityInfo = getPriorityLabel(task.priority);

              return (
                <div
                  key={task.id}
                  className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors space-y-2"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <a
                          href={task.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium hover:underline flex items-center gap-1"
                        >
                          {task.name}
                          <ExternalLink className="size-3" />
                        </a>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs">
                        {/* Status Badge */}
                        <Badge variant={getStatusColor(task.status) as any}>
                          {task.status}
                        </Badge>

                        {/* Priority Badge */}
                        {priorityInfo && (
                          <Badge variant={priorityInfo.color as any}>
                            {priorityInfo.text}
                          </Badge>
                        )}

                        {/* Due Date */}
                        {dueInfo && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="size-3" />
                            <span className={dueInfo.color === 'destructive' ? 'text-destructive' : ''}>
                              {dueInfo.text}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {/* Project/Space */}
                        {task.space && (
                          <div className="flex items-center gap-1">
                            <FolderOpen className="size-3" />
                            <span>{task.space.name}</span>
                          </div>
                        )}

                        {/* List */}
                        <div className="flex items-center gap-1">
                          <List className="size-3" />
                          <span>{task.list.name}</span>
                        </div>

                        {/* Folder */}
                        {task.folder && (
                          <div className="flex items-center gap-1">
                            <span>/ {task.folder.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && !error && tasks.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">
              {tasks.length} active {tasks.length === 1 ? 'task' : 'tasks'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
