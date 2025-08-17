import axios from 'axios';
import { WeatherResponse, HourlyForecastResponse } from '@/types/weather';
import { API_BASE_URL, API_KEY } from '@/config/api';

export const weatherApi = {
  async getCurrentWeather(city: string): Promise<WeatherResponse> {
    const response = await axios.get(`${API_BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
        lang: 'en',
      },
    });
    return response.data;
  },

  async getHourlyForecast(city: string): Promise<HourlyForecastResponse> {
    const response = await axios.get(`${API_BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
        lang: 'en',
      },
    });
    return response.data;
  },
};
