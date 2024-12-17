import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import styles from './WeatherDetailsPage.module.scss';
import { fetchHourlyWeatherData } from '../../api/weatherService';
import { HourlyWeather } from '../../types/weatherTypes';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface WeatherData {
  city: {
    name: string;
  };
  list: HourlyWeather[];
}

const WeatherDetailsPage = () => {
  const { city } = useParams<{ city: string }>();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [dayOffset, setDayOffset] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const getDayStartTimestamp = (offset: number): number => {
    const day = new Date();
    day.setDate(day.getDate() + offset);
    day.setHours(0, 0, 0, 0);
    return day.getTime() / 1000;
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await fetchHourlyWeatherData(city!);
        setWeatherData(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setError('Failed to load weather data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  useEffect(() => {
    if (!weatherData) return;

    const hasDataForDay = (offset: number): boolean => {
      const dayStart = getDayStartTimestamp(offset);
      const dayEnd = dayStart + 86400;
      return weatherData.list.some((hour) => hour.dt >= dayStart && hour.dt < dayEnd);
    };

    let nextOffset = dayOffset;
    while (nextOffset <= 2 && !hasDataForDay(nextOffset)) {
      nextOffset++;
    }
    setDayOffset(nextOffset);
  }, [weatherData, dayOffset]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!weatherData) return <p>No weather data available for city {city}.</p>;

  const dayStartTimestamp = getDayStartTimestamp(dayOffset);
  const dayEndTimestamp = dayStartTimestamp + 86400;
  const currentHour = dayOffset === 0 ? new Date().getHours() : 0;

  const hoursInDay = Array.from({ length: 24 - currentHour }, (_, i) => dayStartTimestamp + (currentHour + i) * 3600);

  const hourlyDataMap = new Map<number, number>();
  weatherData.list.forEach((hour) => {
    if (hour.dt >= dayStartTimestamp && hour.dt < dayEndTimestamp) {
      hourlyDataMap.set(hour.dt, hour.main.temp);
    }
  });

  const hourlyLabels: string[] = [];
  const hourlyTemps: number[] = [];
  let lastKnownTemp: number | null = null;

  const earliestTemp = weatherData.list.find((hour) => hour.dt >= dayStartTimestamp)?.main.temp || null;

  hoursInDay.forEach((hourTimestamp) => {
    const temp = hourlyDataMap.get(hourTimestamp);

    if (temp !== undefined) {
      lastKnownTemp = temp;
    } else if (lastKnownTemp === null && earliestTemp !== null) {
      lastKnownTemp = earliestTemp;
    }

    hourlyLabels.push(
      new Date(hourTimestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
    hourlyTemps.push(lastKnownTemp !== null ? Math.round(lastKnownTemp) : 0);
  });

  const chartData = {
    labels: hourlyLabels,
    datasets: [
      {
        label: 'Temperature (°C)',
        data: hourlyTemps,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          stepSize: 1,
          beginAtZero: false,
        },
      },
    },
  };

  return (
    <div className={styles['weather-container']}>
      <button className={styles['back-button']} onClick={() => navigate('/')}>
        Back
      </button>
      <h4>Temperature on {new Date(dayStartTimestamp * 1000).toLocaleDateString()}</h4>

      <div className={styles['main-content']}>
        <div className={styles['temperature-chart']}>
          <Line data={chartData} options={chartOptions}/>
        </div>
      </div>

      <div className={styles['day-navigation']}>
        <button
          onClick={() => setDayOffset((prev) => Math.max(prev - 1, 0))}
          disabled={dayOffset === 0}
        >
          Previous Day
        </button>
        <button onClick={() => setDayOffset((prev) => prev + 1)} disabled={dayOffset >= 2}>
          Next Day
        </button>
      </div>
    </div>
  );
};

export default WeatherDetailsPage;
