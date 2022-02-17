const express = require("express");
const cors = require("cors")
const app = express();
const port = process.env.PORT || 3000


if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}


const domainsFromEnv = process.env.CORS_DOMAINS || ""

const whitelist = domainsFromEnv.split(",").map(item => item.trim())

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}




//app.use(cors(corsOptions))


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

app.get("/getcity", function (req, res) {
    
  
    //// http://api.openweathermap.org/data/2.5/weather?q=Rome&units=metric&appid=49f45f238ee678f22cf31b86acbe3109
    let city = req.query.city;
    const request = require('request');
    let herokuUrl='https://cors-anywhere.herokuapp.com/';
    let url = `${herokuUrl}http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.API_KEY}`;

    console.log(url)
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

  app.get("/getmsg", function (req, res) {

      res.send("get recived!")
  });
  app.listen(port, () => {
    console.log(`Example app listening at Port: ${port}`)
  })


  /////////////////////////////////////////





