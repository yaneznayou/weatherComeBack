export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.openweathermap.org/data/2.5';
export const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'e6706588711639e75c68982b829347ad';

if (!process.env.NEXT_PUBLIC_API_BASE_URL || !process.env.NEXT_PUBLIC_API_KEY) {
  console.warn('API environment variables not found, using fallback values');
}