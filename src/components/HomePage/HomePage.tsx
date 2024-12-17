import { useEffect, useState } from 'react';
import { fetchWeather } from '../../store/weather/weatherSlice';
import AddCityForm from '../AddCityForm/AddCityForm';
import CityCard from '../CityCard/CityCard';
import styles from './HomePage.module.scss';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';

const HomePage = () => {
  const [cities, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState<Set<string>>(new Set());
  const dispatch = useAppDispatch();

  const weatherData = useAppSelector((state) => state.weather.data);

  useEffect(() => {
    const savedCities = localStorage.getItem('cities');
    if (savedCities) {
      const parsedCities = JSON.parse(savedCities);
      setCities(parsedCities);
    }
  }, []);

  useEffect(() => {
    cities.forEach((city) => {
      if (!weatherData[city] && !loadingCities.has(city)) {
        setLoadingCities((prev) => new Set(prev).add(city));
        dispatch(fetchWeather(city));
      }
    });
  }, [cities, dispatch, weatherData, loadingCities]);

  const addCity = (city: string) => {
    if (!cities.includes(city)) {
      const updatedCities = [...cities, city];
      setCities(updatedCities);
      localStorage.setItem('cities', JSON.stringify(updatedCities));
      setLoadingCities((prev) => new Set(prev).add(city));
      dispatch(fetchWeather(city));
    }
  };

  const removeCity = (city: string) => {
    const updatedCities = cities.filter((item) => item !== city);
    setCities(updatedCities);
    localStorage.setItem('cities', JSON.stringify(updatedCities));
  };

  const updateWeather = (city: string) => {
    setLoadingCities((prev) => new Set(prev).add(city));
    dispatch(fetchWeather(city));
  };

  const onWeatherUpdateComplete = (city: string) => {
    setLoadingCities((prev) => {
      const newSet = new Set(prev);
      newSet.delete(city);
      return newSet;
    });
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.gridContainer}>
        <div className={styles.formContainer}>
          <AddCityForm onAddCity={addCity} />
        </div>
        <div className={styles.cityCardsContainer}>
          {cities.map((city) => {
            const cityWeather = weatherData[city];
            if (!cityWeather || !cityWeather.main) return null;

            const { temp, humidity } = cityWeather.main;
            const { description, icon } = cityWeather.weather[0];
            const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;

            return (
              <CityCard
                key={city}
                city={city}
                temperature={Math.round(temp)}
                weatherDescription={description}
                humidity={humidity}
                iconUrl={iconUrl}
                onRemoveCity={removeCity}
                onUpdateWeather={updateWeather}
                loading={loadingCities.has(city)}
                onWeatherUpdateComplete={onWeatherUpdateComplete}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
