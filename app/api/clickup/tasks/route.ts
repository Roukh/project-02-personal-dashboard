import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the ClickUp personal API token
    const apiToken = process.env.CLICKUP_API_TOKEN;

    if (!apiToken) {
      return NextResponse.json(
        { error: 'ClickUp API token not configured' },
        { status: 500 }
      );
    }

    // First, get the authorized user to verify token and get teams
    const userResponse = await fetch('https://api.clickup.com/api/v2/user', {
      headers: {
        'Authorization': apiToken,
        'Content-Type': 'application/json',
      },
    });

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error('ClickUp user API error:', userResponse.status, errorText);
      throw new Error(`Failed to fetch user: ${userResponse.status} - ${errorText}`);
    }

    const userData = await userResponse.json();

    // Get teams from user data
    if (!userData.user || !userData.user.teams || userData.user.teams.length === 0) {
      return NextResponse.json({ tasks: [] });
    }

    const teamId = userData.user.teams[0].id;

    // Fetch tasks for the team (all tasks, including subtasks)
    const tasksResponse = await fetch(
      `https://api.clickup.com/api/v2/team/${teamId}/task?subtasks=true`,
      {
        headers: {
          'Authorization': apiToken,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!tasksResponse.ok) {
      throw new Error('Failed to fetch tasks');
    }

    const tasksData = await tasksResponse.json();

    // Transform the tasks to include the fields we need
    const tasks = tasksData.tasks.map((task: any) => ({
      id: task.id,
      name: task.name,
      status: task.status.status,
      dueDate: task.due_date ? new Date(parseInt(task.due_date)).toISOString() : null,
      priority: task.priority?.priority || null,
      list: {
        id: task.list.id,
        name: task.list.name,
      },
      folder: task.folder ? {
        id: task.folder.id,
        name: task.folder.name,
      } : null,
      space: task.space ? {
        id: task.space.id,
        name: task.space.name,
      } : null,
      url: task.url,
    }));

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('ClickUp API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks from ClickUp' },
      { status: 500 }
    );
  }
}
