import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import WeatherDetailsPage from './components/WeatherDetailsPage/WeatherDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/weather-details/:city" element={<WeatherDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
