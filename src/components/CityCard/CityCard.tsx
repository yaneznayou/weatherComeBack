'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, Box, IconButton, Tooltip } from '@mui/material';
import { Refresh, Delete, Visibility } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { removeCity, refreshCityWeather } from '@/features/cities/citiesSlice';
import { AppDispatch } from '@/services/store';
import { formatTemperature, formatFeelsLike } from '@/utils/formatTemperature';
import { formatDate } from '@/utils/formatDate';
import Link from 'next/link';
import styles from './CityCard.module.scss';

interface CityCardProps {
  city: any;
}

const CityCard: React.FC<CityCardProps> = ({ city }) => {
  const [isClient, setIsClient] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleRefresh = async () => {
    try {
      await dispatch(refreshCityWeather({ 
        cityId: city.id, 
        cityName: city.name 
      })).unwrap();
    } catch (error) {
      console.error('Error updating weather:', error);
    }
  };

  const handleDelete = () => {
    dispatch(removeCity(city.id));
  };

  if (!isClient) {
    return (
      <Card className={styles.card}>
        <CardContent className={styles.content}>
          <Typography variant="h6" gutterBottom>
            Loading...
          </Typography>
          <Typography color="textSecondary">
            Loading city data...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!city.weather) {
    return (
      <Card className={styles.card}>
        <CardContent className={styles.content}>
          <Typography variant="h6" gutterBottom>
            {city.name}, {city.country}
          </Typography>
          <Typography color="textSecondary">
            Loading weather data...
          </Typography>
          <Box className={styles.actions}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              size="small"
            >
              Refresh
            </Button>
            <IconButton
              onClick={handleDelete}
              color="error"
              size="small"
              title="Delete city"
            >
              <Delete />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const weather = city.weather;
  const weatherIcon = weather.weather[0]?.icon;

  return (
    <Card className={styles.card}>
      <CardContent className={styles.content}>
        <Box className={styles.header}>
          <Typography variant="h6" gutterBottom>
            {city.name}, {city.country}
          </Typography>
          {weatherIcon && (
            <img
              src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`}
              alt={weather.weather[0]?.description}
              className={styles.weatherIcon}
            />
          )}
        </Box>

        <Box className={styles.weatherInfo}>
          <Typography variant="h4" className={styles.temperature}>
            {formatTemperature(weather.main.temp)}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {weather.weather[0]?.description}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {formatFeelsLike(weather.main.feels_like)}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Updated: {formatDate(weather.dt)}
          </Typography>
        </Box>

        <Box className={styles.actions}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            size="small"
          >
            Refresh
          </Button>
          
          <Link href={`/city/${city.id}`}>
            <Button
              variant="outlined"
              startIcon={<Visibility />}
              size="small"
            >
              Details
            </Button>
          </Link>
          
          <IconButton
            onClick={handleDelete}
            color="error"
            size="small"
            title="Delete city"
          >
            <Delete />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
    );
};

export default CityCard;
