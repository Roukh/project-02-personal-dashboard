# Personal Dashboard

A modern, customizable personal dashboard built with Next.js 16, React 19, and Tailwind CSS v4. Track your weather, stocks, tasks, news, and calendar events all in one place.

## Features

- **Real-time Weather**: Current conditions and 5-day forecast with city search
- **Stock Market Tracking**: Monitor your favorite stocks with real-time price updates
- **News Feed**: Latest headlines from top sources
- **Calendar Widget**: Interactive calendar for viewing and managing events
- **ClickUp Integration**: View your tasks and project information
- **Theme Toggle**: Switch between light and dark modes
- **Responsive Design**: Optimized for desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4 with custom theming
- **UI Components**: shadcn/ui components
- **Icons**: Lucide React
- **Theme Management**: next-themes

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd project-02-personal-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your API keys:
```env
# Weather API (OpenWeatherMap)
NEXT_PUBLIC_OPEN_WEATHER_MAP_API=your_openweathermap_api_key

# Stocks API (Alpha Vantage)
NEXT_PUBLIC_STOCKS_API=your_alpha_vantage_api_key

# News API
NEXT_PUBLIC_NEWS_API=your_news_api_key

# ClickUp API
CLICKUP_API_TOKEN=your_clickup_api_token
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Keys Setup

### OpenWeatherMap (Weather)
1. Sign up at [https://openweathermap.org/api](https://openweathermap.org/api)
2. Generate a free API key
3. Add to `.env.local` as `NEXT_PUBLIC_OPEN_WEATHER_MAP_API`

### Alpha Vantage (Stocks)
1. Sign up at [https://www.alphavantage.co/support/#api-key](https://www.alphavantage.co/support/#api-key)
2. Get your free API key
3. Add to `.env.local` as `NEXT_PUBLIC_STOCKS_API`
4. Note: Free tier has rate limits (5 calls/min)

### News API
1. Sign up at [https://newsapi.org/register](https://newsapi.org/register)
2. Get your API key
3. Add to `.env.local` as `NEXT_PUBLIC_NEWS_API`

### ClickUp
1. Go to your ClickUp settings: [https://app.clickup.com/settings/apps](https://app.clickup.com/settings/apps)
2. Generate a Personal API Token
3. Add to `.env.local` as `CLICKUP_API_TOKEN`

## Known Issues

### ClickUp API Data Fetch

⚠️ **Current Status**: The ClickUp integration currently has a data loading issue.

**What's Working:**
- API authentication connects successfully
- The connection to ClickUp API is established

**What's Not Working:**
- Task data is not being loaded/displayed correctly
- The API response may be returning an unexpected format or empty results

**Potential Causes:**
- The team/workspace structure in ClickUp may differ from what the API expects
- API endpoint may need adjustment for different ClickUp workspace configurations
- Task filtering or permissions may be affecting data retrieval

**Temporary Workaround:**
- The widget will display "No tasks found" or "Failed to load tasks from ClickUp"
- Other widgets remain fully functional

**To Debug:**
1. Check the browser console for API error messages
2. Verify your `CLICKUP_API_TOKEN` has proper permissions
3. Check the API route at `/api/clickup/tasks` for detailed error logs
4. Ensure your ClickUp workspace has accessible tasks

This issue is being investigated and will be fixed in a future update.

## Project Structure

```
├── app/
│   ├── api/
│   │   └── clickup/
│   │       └── tasks/          # ClickUp API route
│   ├── CalendarWidget.tsx      # Calendar component
│   ├── ForecastCard.tsx        # Weather forecast
│   ├── NewsWidget.tsx          # News feed
│   ├── StocksWidget.tsx        # Stock market tracker
│   ├── TaskList.tsx            # ClickUp tasks
│   ├── WeatherCard.tsx         # Current weather
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main dashboard page
├── components/
│   ├── ui/                     # Reusable UI components
│   ├── theme-provider.tsx      # Theme context
│   └── theme-toggle.tsx        # Light/Dark mode toggle
└── public/                     # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment to Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/project-02-personal-dashboard)

### Manual Deployment

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**:
   ```bash
   vercel
   ```
   Follow the prompts to link your project.

### Adding Environment Variables to Vercel

After deploying, you need to add your API keys as environment variables:

#### Method 1: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Select your project from the dashboard
3. Click on **Settings** → **Environment Variables**
4. Add each variable:

   | Variable Name | Example Value | Environment |
   |--------------|---------------|-------------|
   | `NEXT_PUBLIC_OPEN_WEATHER_MAP_API` | `your_api_key_here` | Production, Preview, Development |
   | `NEXT_PUBLIC_STOCKS_API` | `your_api_key_here` | Production, Preview, Development |
   | `NEXT_PUBLIC_NEWS_API` | `your_api_key_here` | Production, Preview, Development |
   | `CLICKUP_API_TOKEN` | `your_api_key_here` | Production, Preview, Development |

5. For each variable:
   - Enter the **Name** (e.g., `NEXT_PUBLIC_OPEN_WEATHER_MAP_API`)
   - Enter the **Value** (your actual API key)
   - Select environments: ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**

6. **Redeploy your application**:
   - Go to **Deployments** tab
   - Click the ⋯ menu on your latest deployment
   - Select **Redeploy** to apply the new variables

#### Method 2: Via Vercel CLI

```bash
# Login to Vercel
vercel login

# Add environment variables
vercel env add NEXT_PUBLIC_OPEN_WEATHER_MAP_API
# Enter value when prompted, select environments

# Repeat for all variables
vercel env add NEXT_PUBLIC_STOCKS_API
vercel env add NEXT_PUBLIC_NEWS_API
vercel env add CLICKUP_API_TOKEN
```

#### Method 3: Bulk Import

1. In Vercel Dashboard → Settings → Environment Variables
2. Click **Add New** dropdown → Select **Paste .env**
3. Copy the contents from your `.env.local` file
4. Paste and click **Add**
5. Select which environments to apply to

### Important Security Notes

⚠️ **Public vs Private Variables**:
- Variables with `NEXT_PUBLIC_` prefix are exposed to the browser
- Variables without this prefix are server-side only (like `CLICKUP_API_TOKEN`)
- Never add sensitive tokens with the `NEXT_PUBLIC_` prefix

📝 **After Adding Variables**:
- Environment variables are only available after redeployment
- Push a new commit or manually redeploy to apply changes
- Variables are encrypted and stored securely by Vercel

### Automatic Deployments

Vercel automatically deploys:
- **Production**: Every push to your `main` branch
- **Preview**: Every push to other branches or pull requests

You can configure deployment settings in the Vercel dashboard under **Settings** → **Git**.

## Customization

### Adding Widgets
1. Create a new component in the `app/` directory
2. Import and add it to `app/page.tsx`
3. Follow the existing widget patterns for consistent styling

### Changing Theme Colors
Edit the CSS variables in `app/globals.css` under `:root` and `.dark` sections.

### Modifying Stock Symbols
Edit the `STOCK_SYMBOLS` array in `app/StocksWidget.tsx`:
```typescript
const STOCK_SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN'];
```

### Changing Default City (Weather)
Modify the default city in `app/WeatherCard.tsx` and `app/ForecastCard.tsx`:
```typescript
const [city, setCity] = useState('YourCity');
```

## Performance Notes

- **Auto-Refresh**: All data widgets automatically refresh every 5 minutes with manual refresh buttons
- **Stock Widget**: Implements caching (5-minute cache) to respect API rate limits
- **Weather Data**: Auto-refreshes every 5 minutes, or when city changes
- **News**: Auto-refreshes every 5 minutes
- **Tasks**: Auto-refreshes every 5 minutes to stay in sync with ClickUp
- **Theme**: Persists user preference in localStorage
- **Interval Cleanup**: All refresh intervals are properly cleaned up on component unmount

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues, questions, or suggestions, please open an issue in the GitHub repository.

---

Built with ❤️ using Next.js and shadcn/ui
