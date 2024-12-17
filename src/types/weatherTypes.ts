export interface WeatherData {
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
}

export interface WeatherState {
  data: Record<string, WeatherData>;
  loading: boolean;
  error: string | null;
}

export interface HourlyWeather {
  dt: number;
  main: {
    temp: number;
  };
}
  