import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { City } from '@/types/weather';
import { weatherApi } from '../weather/weatherApi';

interface CitiesState {
  cities: City[];
  loading: boolean;
  error: string | null;
}

const initialState: CitiesState = {
  cities: [],
  loading: false,
  error: null
};

const getErrorMessage = (error: any): string => {
  if (error?.response?.status === 404) {
    return 'City not found. Please check the city name and try again.';
  }
  if (error?.response?.status === 400) {
    return 'Invalid city name. Please enter a valid city name.';
  }
  if (error?.response?.status === 429) {
    return 'Too many requests. Please wait a moment and try again.';
  }
  if (error?.response?.status >= 500) {
    return 'Weather service is temporarily unavailable. Please try again later.';
  }
  if (error?.message?.includes('Network Error')) {
    return 'Network error. Please check your internet connection.';
  }
  return 'Failed to fetch weather data. Please try again.';
};

export const fetchCityWeather = createAsyncThunk(
  'cities/fetchCityWeather',
  async (cityName: string, { rejectWithValue }) => {
    try {
      const weatherData = await weatherApi.getCurrentWeather(cityName);
      return {
        id: `${weatherData.name}-${weatherData.sys.country}`,
        name: weatherData.name,
        country: weatherData.sys.country,
        weather: weatherData
      };
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const refreshCityWeather = createAsyncThunk(
  'cities/refreshCityWeather',
  async ({ cityId, cityName }: { cityId: string; cityName: string }, { rejectWithValue }) => {
    try {
      const weatherData = await weatherApi.getCurrentWeather(cityName);
      return { cityId, weather: weatherData };
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    addCity: (state, action: PayloadAction<City>) => {
      const existingCity = state.cities.find(city => city.id === action.payload.id);
      if (!existingCity) {
        state.cities.push(action.payload);
      }
    },
    removeCity: (state, action: PayloadAction<string>) => {
      state.cities = state.cities.filter(city => city.id !== action.payload);
    },
    setCities: (state, action: PayloadAction<City[]>) => {
      state.cities = action.payload;
    },
    clearAllCities: (state) => {
      state.cities = [];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCityWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCityWeather.fulfilled, (state, action) => {
        state.loading = false;
        const existingCity = state.cities.find(city => city.id === action.payload.id);
        if (!existingCity) {
          state.cities.push(action.payload);
        }
      })
      .addCase(fetchCityWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch weather';
      })
      .addCase(refreshCityWeather.fulfilled, (state, action) => {
        const city = state.cities.find(c => c.id === action.payload.cityId);
        if (city) {
          city.weather = action.payload.weather;
        }
      })
      .addCase(refreshCityWeather.rejected, (state, action) => {
        console.error('Failed to refresh weather:', action.payload);
      });
  }
});

export const { 
  addCity, 
  removeCity, 
  setCities, 
  clearAllCities,
  clearError
} = citiesSlice.actions;

export default citiesSlice.reducer;
