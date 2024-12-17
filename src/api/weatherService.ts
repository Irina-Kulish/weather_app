import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchWeatherData = async (city: string) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    return response.data;
  } catch (error) {
    console.error('Error retrieving weather data:', error);
    throw error;
  }
};

export const fetchHourlyWeatherData = async (city: string) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );

    return {
      city: response.data.city,
      list: response.data.list,
    };
  } catch (error) {
    console.error('Error retrieving weather data:', error);
    throw error;
  }
};
