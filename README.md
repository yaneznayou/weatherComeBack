# Weather Forecast Application

A weather application for displaying weather in selected cities, built on Next.js using TypeScript, Redux Toolkit and Material UI.

## Technologies

- **Next.js 15** (App Router)
- **TypeScript**
- **Redux Toolkit** (Slices + Async Thunks)
- **Axios** for HTTP requests
- **SCSS Modules**
- **Material UI**
- **Chart.js** for charts
- **ESLint + Prettier**

## Features

- 📍 Add cities with instant weather retrieval
- 🌤️ Display current weather in cards
- 📊 Detailed city page with hourly temperature forecast
- 🔄 Update weather for individual cities
- 💾 Save city list in localStorage
- 📱 Responsive design (mobile-first)

## Installation and Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd weather-app
```

2. Install dependencies:
```bash
npm install
```

3. The API key is already configured in the code

4. Start the application:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router
├── components/            # React components
├── features/              # Redux slices with async thunks
├── hooks/                 # Custom hooks
├── services/              # Redux store
├── styles/                # SCSS modules
├── types/                 # TypeScript types
└── utils/                 # Formatting utilities
```

## Architecture

- **Redux Toolkit**: State management with async thunks for API calls
- **Axios**: HTTP client for weather API requests
- **Async Thunks**: Handle loading states and errors
- **Local Storage**: Persist city list between sessions

## Usage

1. **Adding a city**: Enter a city name in the form on the main page
2. **Viewing weather**: Weather automatically loads and displays in cards
3. **Updating**: Click the "Refresh" button to get current data
4. **Details**: Navigate to the details page to view hourly forecast
5. **Removing**: Use the delete button to remove cities from the list

## API

The application uses [OpenWeatherMap API](https://openweathermap.org/api):
- **Current weather**: `/weather` endpoint
- **Hourly forecast**: `/forecast` endpoint

## Responsiveness

- Mobile-first approach
- Adaptive card grid
- Responsive Material UI components
- Mobile device optimization

## Development

```bash
# Start development mode
npm run dev

# Build for production
npm run build

# Start built application
npm start

# Lint check
npm run lint
```

## License

MIT
