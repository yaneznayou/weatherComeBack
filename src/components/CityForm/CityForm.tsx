'use client';

import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Alert, IconButton } from '@mui/material';
import { Close, Error } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCityWeather, clearError } from '@/features/cities/citiesSlice';
import { AppDispatch, RootState } from '@/services/store';
import styles from './CityForm.module.scss';

const CityForm: React.FC = () => {
  const [cityName, setCityName] = useState('');
  const [isClient, setIsClient] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.cities);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cityName.trim()) {
      return;
    }

    try {
      await dispatch(fetchCityWeather(cityName.trim())).unwrap();
      setCityName('');
    } catch (err: any) {
      console.error('Failed to add city:', err);
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  if (!isClient) {
    return (
      <Box className={styles.form}>
        <Typography variant="h6" gutterBottom>
          Add City
        </Typography>
        <Box className={styles.inputGroup}>
          <TextField
            fullWidth
            label="City Name"
            disabled={true}
            placeholder="Loading..."
          />
          <Button
            type="submit"
            variant="contained"
            disabled={true}
            className={styles.button}
          >
            Loading...
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} className={styles.form}>
      <Typography variant="h6" gutterBottom>
        Add City
      </Typography>
      
      {error && (
        <Alert 
          severity="error" 
          onClose={handleClearError}
          sx={{ mb: 2 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClearError}
            >
              <Close fontSize="inherit" />
            </IconButton>
          }
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Error fontSize="small" />
            {error}
          </Box>
        </Alert>
      )}
      
      <Box className={styles.inputGroup}>
        <TextField
          fullWidth
          label="City Name"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          placeholder="e.g., Kyiv, Lviv, Kharkiv"
          disabled={loading}
          error={!!error}
          className={styles.input}
          helperText={error ? "Please check the city name and try again" : ""}
        />
        
        <Button
          type="submit"
          variant="contained"
          disabled={loading || !cityName.trim()}
          className={styles.button}
        >
          {loading ? 'Adding...' : 'Add'}
        </Button>
      </Box>
    </Box>
  );
};

export default CityForm;
