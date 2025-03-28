import express from 'express';

const port = 8080;

const app = express();

const postleitzahl = process.argv[2]
let apiURL = "https://app-prod-ws.meteoswiss-app.ch/v1/plzDetail?plz=" + postleitzahl + "00";

const response = await fetch(apiURL);
const data = await response.json();
const weatherData = data.currentWeather.temperature;

app.get('/', (request, response) => {
    response.send(weatherData.toString());
});

app.listen(port, () => {
    console.log(`Listenig port ${port}`);
});