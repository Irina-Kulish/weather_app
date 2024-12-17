import { useState } from 'react';
import { TextField, Button, Snackbar, Alert } from '@mui/material';
import styles from './AddCityForm.module.scss';
import { fetchWeatherData } from '../../api/weatherService';

interface AddCityFormProps {
  onAddCity: (city: string) => void;
}

const AddCityForm = ({ onAddCity }: AddCityFormProps) => {
  const [city, setCity] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      setErrorMessage('');
      setOpenSnackbar(false);
      try {
        const weatherData = await fetchWeatherData(city.trim());
        if (weatherData) {
          onAddCity(city.trim().toLowerCase());
          setCity('');
        } else {
          throw new Error('City not found');
        }
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
        setOpenSnackbar(true);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <TextField
        label="City Name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        variant="outlined"
        required
        className={styles['text-field']}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        className={styles.button}
      >
        Add City
      </Button>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {errorMessage || 'City not found!'}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default AddCityForm;
