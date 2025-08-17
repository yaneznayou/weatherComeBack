'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Container, Button } from '@mui/material';
import { DeleteSweep } from '@mui/icons-material';
import { Provider } from 'react-redux';
import { store } from '@/services/store';
import CityForm from '@/components/CityForm/CityForm';
import CityCard from '@/components/CityCard/CityCard';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { setCities, clearAllCities } from '@/features/cities/citiesSlice';
import { RootState, AppDispatch } from '@/services/store';
import { City } from '@/types/weather';

const WeatherApp: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const cities = useSelector((state: RootState) => state.cities.cities);
  const dispatch = useDispatch<AppDispatch>();
  const [storedCities, setStoredCities] = useLocalStorage<City[]>('cities', []);
  const isInitialized = useRef(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isInitialized.current && storedCities.length > 0) {
      dispatch(setCities(storedCities));
      isInitialized.current = true;
    } else if (!isInitialized.current) {
      isInitialized.current = true;
    }
  }, [storedCities, dispatch]);

  useEffect(() => {
    if (isInitialized.current) {
      setStoredCities(cities);
    }
  }, [cities, setStoredCities]);

  const handleClearAll = () => {
    dispatch(clearAllCities());
  };

    if (!isClient) {
    return (
      <div suppressHydrationWarning={true}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
            Loading...
          </Typography>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Loading weather application...
            </Typography>
          </Box>
        </Container>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning={true}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          Weather Forecast
        </Typography>
        
        <CityForm />
        
        {cities.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Add a city to view weather
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Enter a city name in the form above
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteSweep />}
                onClick={handleClearAll}
                size="small"
              >
                Clear All Cities
              </Button>
            </Box>
            
            <Box className="grid">
              {cities.map((city) => (
                <CityCard key={city.id} city={city} />
              ))}
            </Box>
          </>
        )}
      </Container>
    </div>
  );
};

const Page: React.FC = () => {
  return (
    <Provider store={store}>
      <WeatherApp />
    </Provider>
  );
};

export default Page;
