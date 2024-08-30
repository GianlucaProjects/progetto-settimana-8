// src/App.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
  Carousel,
} from "react-bootstrap";
import "./App.css";

const API_KEY = "e83049ea803a8e8ff4e786d5a41d336d"; // Sostituisci con la tua API key di OpenWeatherMap

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (weatherData) {
      //fetchWeatherData(city);
      fetchForecastData(city);
    }
  }, [city, weatherData]);

  const fetchWeatherData = async (city) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) {
        throw new Error("Errore nel recupero dei dati meteo");
      }
      const data = await response.json();
      setWeatherData(data);
      setError("");
    } catch (error) {
      setError("Errore nel recupero dei dati meteo. Per favore riprova.");
    }
  };

  const fetchForecastData = async (city) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) {
        throw new Error("Errore nel recupero dei dati delle previsioni");
      }
      const data = await response.json();
      setForecastData(data);
      setError("");
    } catch (error) {
      setError(
        "Errore nel recupero dei dati delle previsioni. Per favore riprova."
      );
    }
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h1 className="text-center mb-4">Weather App</h1>
          <Form>
            <Form.Group controlId="cityInput">
              <Form.Label>Inserisci una città</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserisci una città"
                value={city}
                onChange={handleCityChange}
              />
            </Form.Group>
            <Button
              variant="primary"
              className="mt-2"
              onClick={() => fetchWeatherData(city)}
            >
              Ottieni Meteo
            </Button>
          </Form>
          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
        </Col>
      </Row>
      <Row className="mt-4 d-flex justify-content-center">
        {weatherData && (
          <Col md={6} className="text-center">
            <WeatherDisplay data={weatherData} />
          </Col>
        )}
      </Row>
      <Row className="mt-4 d-flex justify-content-center">
        {forecastData && (
          <Col md={6} className="text-center">
            <ForecastDisplay data={forecastData} />
          </Col>
        )}
      </Row>
    </Container>
  );
}

const WeatherDisplay = ({ data }) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>Meteo attuale in {data.name}</Card.Title>
        <Card.Text>
          <strong>Temperatura:</strong> {data.main.temp} °C
          <br />
          <strong>Condizioni:</strong> {data.weather[0].description}
          <br />
          <strong>Umidità:</strong> {data.main.humidity}%<br />
          <strong>Vento:</strong> {data.wind.speed} m/s
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

const ForecastDisplay = ({ data }) => {
  return (
    <>
      <h3 className="text-dark">Orario nelle prossime ore:</h3>
      <Carousel className="mt-4">
        {data.list.slice(0, 4).map((forecast, index) => (
          <Carousel.Item key={index}>
            <img
              src="/white-img.jpg" // Percorso corretto dell'immagine
              alt={`Slide ${index}`} // Testo alternativo per accessibilità
              className="d-block w-100" // Classi Bootstrap per immagini responsive
            />
            <Carousel.Caption>
              <h3 className="text-dark">
                <strong>Orario:</strong>
                {" " + new Date(forecast.dt_txt).getHours() + ":00"}
              </h3>
              <h3 className="text-dark">
                <strong>Temperatura:</strong> {forecast.main.temp} °C
              </h3>
              <h3 className="text-dark">
                <strong>Condizioni:</strong> {forecast.weather[0].description}
              </h3>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </>
  );
};

export default App;
