export const formatTemperature = (temp: number): string => {
  return `${Math.round(temp)}°C`;
};

export const formatFeelsLike = (feelsLike: number): string => {
  return `Feels like ${Math.round(feelsLike)}°C`;
};
