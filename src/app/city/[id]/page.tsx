'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Grid,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Provider } from 'react-redux';
import { store } from '@/services/store';
import { RootState } from '@/services/store';
import { weatherApi } from '@/features/weather/weatherApi';
import { formatTemperature, formatFeelsLike } from '@/utils/formatTemperature';
import { formatDate, formatTime } from '@/utils/formatDate';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CityDetailPage: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const params = useParams();
  const router = useRouter();
  const cityId = params.id as string;
  
  const cities = useSelector((state: RootState) => state.cities.cities);
  const city = cities.find(c => c.id === cityId);
  
  const [hourlyForecast, setHourlyForecast] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (city?.name) {
      fetchHourlyForecast();
    }
  }, [city?.name]);

  const fetchHourlyForecast = async () => {
    if (!city?.name) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await weatherApi.getHourlyForecast(city.name);
      setHourlyForecast(data);
    } catch (err: any) {
      let errorMessage = 'Error loading forecast';
      
      if (err?.response?.status === 404) {
        errorMessage = 'Hourly forecast not available for this city.';
      } else if (err?.response?.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (err?.response?.status >= 500) {
        errorMessage = 'Weather service is temporarily unavailable. Please try again later.';
      } else if (err?.message?.includes('Network Error')) {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      
      setError(errorMessage);
      console.error('Failed to fetch hourly forecast:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return (
      <div suppressHydrationWarning={true}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            Loading...
          </Typography>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        </Container>
      </div>
    );
  }

  if (!city) {
    return (
      <div suppressHydrationWarning={true}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            City not found
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<ArrowBack />}
            onClick={() => router.push('/')}
          >
            Back to Home
          </Button>
        </Container>
      </div>
    );
  }

  const weather = city.weather;
  const weatherIcon = weather?.weather[0]?.icon;

  const chartData = hourlyForecast ? {
    labels: hourlyForecast.list.slice(0, 24).map((item: any) => 
      formatTime(item.dt)
    ),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: hourlyForecast.list.slice(0, 24).map((item: any) => item.main.temp),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Hourly Temperature Forecast',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div suppressHydrationWarning={true}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBack />}
            onClick={() => router.push('/')}
            sx={{ mb: 2 }}
          >
            Back to Home
          </Button>
          
          <Typography variant="h3" component="h1" gutterBottom>
            {city.name}, {city.country}
          </Typography>
        </Box>

        {weather && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" sx={{ mr: 2 }}>
                      {formatTemperature(weather.main.temp)}
                    </Typography>
                    {weatherIcon && (
                      <img
                        src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`}
                        alt={weather.weather[0]?.description}
                        style={{ width: 80, height: 80 }}
                      />
                    )}
                  </Box>
                  
                  <Typography variant="h6" gutterBottom>
                    {weather.weather[0]?.description}
                  </Typography>
                  
                  <Typography variant="body1" gutterBottom>
                    {formatFeelsLike(weather.main.feels_like)}
                  </Typography>
                  
                  <Typography variant="body2" color="textSecondary">
                    Updated: {formatDate(weather.dt)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Details
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Humidity
                      </Typography>
                      <Typography variant="body1">
                        {weather.main.humidity}%
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Pressure
                      </Typography>
                      <Typography variant="body1">
                        {weather.main.pressure} hPa
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Wind
                      </Typography>
                      <Typography variant="body1">
                        {weather.wind.speed} m/s
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Visibility
                      </Typography>
                      <Typography variant="body1">
                        {weather.visibility / 1000} km
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {hourlyForecast && chartData && (
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Hourly Forecast
              </Typography>
              <Box sx={{ height: 400 }}>
                <Line data={chartData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        )}

        {error && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto' }}>
              {error}
            </Alert>
          </Box>
        )}
      </Container>
    </div>
  );
};

const Page: React.FC = () => {
  return (
    <Provider store={store}>
      <CityDetailPage />
    </Provider>
  );
};

export default Page;
