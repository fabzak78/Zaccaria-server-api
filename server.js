const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();

// Configure dotenv package

require("dotenv").config();

const apiKey = `${process.env.API_KEY}`;

// Setup your express app and body-parser configurations
// Setup your javascript template view engine
// we will serve your static pages from the public directory, it will act as your root directory
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


app.get("/", function (req, res) {
    
    //res.send("prova");
    //// http://api.openweathermap.org/data/2.5/weather?q=Rome&units=metric&appid=49f45f238ee678f22cf31b86acbe3109
    let city = req.query.city;
    const request = require('request');
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.API_KEY}`;
    //console.log(url)
    request(url, function (error, response, body) {
      //console.error('error:', error); // Print the error if one occurred
      //let data = JSON.parse(body)
      let weather = JSON.parse(body);
      //console.log(weather.weather)
      
      if (response.statusCode === 200)
      {
          res.send(`${weather.weather[0]}`)
          //  res.send(`il meteo nella città di "${city}" è ${weather.weather[0].description}`)
      }
      //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      //console.log('body:', body); // Print the HTML for the Google homepage.
    });
  });


  // On a post request, the app shall data from OpenWeatherMap using the given arguments
app.post('/', function(req, res) {

    // Get city name passed in the form
    let city = req.body.city;

    // Use that city name to fetch data
    // Use the API_KEY in the '.env' file
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
});

app.listen(process.env.PORT || 5000, function () {
    console.log("Weather app listening on port 5000!");
  });