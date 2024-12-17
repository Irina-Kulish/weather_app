import { FC, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';
import { Refresh, Delete, Info } from '@mui/icons-material';
import styles from './CityCard.module.scss';

interface CityCardProps {
  city: string;
  temperature: number;
  weatherDescription: string;
  humidity: number;
  iconUrl: string;
  onRemoveCity: (city: string) => void;
  onUpdateWeather: (city: string) => void;
  loading: boolean;
  onWeatherUpdateComplete: (city: string) => void;
}

const CityCard: FC<CityCardProps> = ({
  city,
  temperature,
  weatherDescription,
  humidity,
  iconUrl,
  onRemoveCity,
  onUpdateWeather,
  loading,
  onWeatherUpdateComplete,
}) => {
  const capitalizeCityName = (cityName: string) => {
    return cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();
  };

  useEffect(() => {
    if (loading) {
      onWeatherUpdateComplete(city);
    }
  }, [loading, city, onWeatherUpdateComplete]);

  if (!city || !temperature || !weatherDescription || !humidity || !iconUrl) {
    console.error('Error in data for city:', city);
    return <p>Failed to load weather data for city {city}</p>;
  }

  return (
    <div className={styles.cityCard}>
      <div className={styles.cityHeader}>
        <h3>{capitalizeCityName(city)}</h3>
        <img src={iconUrl} alt={weatherDescription} className={styles.weatherIcon} />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div>
            <p>Temperature: {temperature}°C</p>
            <p>Description: {weatherDescription}</p>
            <p>Humidity: {humidity}%</p>
          </div>
          <div className="mt-2">
            <Tooltip title="Update Weather" arrow>
              <IconButton
                onClick={() => onUpdateWeather(city)}
                color="primary"
                aria-label="Update Weather"
              >
                <Refresh />
              </IconButton>
            </Tooltip>

            <Link to={`/weather-details/${city}`} className="btn btn-link" aria-label="Details">
              <Tooltip title="Details" arrow>
                <IconButton color="primary" aria-label="Details">
                  <Info />
                </IconButton>
              </Tooltip>
            </Link>

            <Tooltip title="Remove" arrow>
              <IconButton
                onClick={() => onRemoveCity(city)}
                color="error"
                aria-label="Remove"
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </div>
        </>
      )}
    </div>
  );
};

export default CityCard;
