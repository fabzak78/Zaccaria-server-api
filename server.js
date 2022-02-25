const express = require("express");
const cors = require('cors')
const app = express();
const port = process.env.PORT || 8080
const request = require('request');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');


app.use(cors())


if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


// login json example
// {
// 	"id": "1",
// 	"username": "michele",
// 	"email": "michele@mail.com",
//  "acceskey" : "EnhancersDemo"
// }



app.post('/api/login', jsonParser,function (req, res) {
  console.log('Body Request:', req.body);
  const user = {
    id: req.body.id,
    username: req.body.username,
    email: req.body.email,
    access_key: req.body.acceskey
  }
  
  if (process.env.SECRET_KEY === req.body.acceskey) {

    jwt.sign({ user: user }, process.env.SECRET_KEY, (err, token) => {
      res.set('Access-Control-Allow-Origin', '*');
      res.json({
        token,
      });
    });
  } else
  {
    res.set('Access-Control-Allow-Origin', '*');
    res.sendStatus(403);
  } 


});

app.post('/api/profile', verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {

    if (err) {
      res.set('Access-Control-Allow-Origin', '*');
      res.sendStatus(403); //Forbidden
    } else {
      res.set('Access-Control-Allow-Origin', '*');
      res.json({
        'message': 'Il mio Profilo',
        authData
      });
    }


  });


});



app.get("/api/getcity", verifyToken, (req, res) => {
  //http://localhost:3000/getCity?city=rome
  let city = req.query.city;
  let urlOpenweathermap = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.API_KEY}`;
  request(urlOpenweathermap, function (error, response, body) {
    let weather = JSON.parse(body);
    if (response.statusCode === 200) {
      res.set('Access-Control-Allow-Origin', '*');
      res.send(weather)
      //res.send(`${weather.weather[0]}`)

    }
  });
});


app.get("/api/getcityhourly", verifyToken, (req, res) => {
  //http://localhost:3000/getCity?city=rome
  let city = req.query.city;
  let urlOpenweathermap = `http://pro.openweathermap.org/data/2.5/forecast/hourly?q=${city}&units=metric&appid=${process.env.API_KEY_PRO}`;
  request(urlOpenweathermap, function (error, response, body) {
    let weather = JSON.parse(body);
    if (response.statusCode === 200) {
      res.set('Access-Control-Allow-Origin', '*');
      res.send(weather)
      //res.send(`${weather.weather[0]}`)

    }
  });
});

app.get("/api/getcityclimate", verifyToken, (req, res) => {
  //http://localhost:3000/getCity?city=rome
  let city = req.query.city;
  let urlOpenweathermap = `http://pro.openweathermap.org/data/2.5/forecast/climate?q=${city}&units=metric&appid=${process.env.API_KEY_PRO}`;
  request(urlOpenweathermap, function (error, response, body) {
    let weather = JSON.parse(body);
    if (response.statusCode === 200) {
      res.set('Access-Control-Allow-Origin', '*');
      res.send(weather)
      //res.send(`${weather.weather[0]}`)

    }
  });
});





app.get("/api/getyelpdata", verifyToken, (req, res) => {
  // http://localhost:3000/getyelpdata?city=rome
  let city = req.query.city;
  let yelpUrl = ` https://api.yelp.com/v3/businesses/search?location=${city}`;
  var options = {
    'method': 'GET',
    'url': yelpUrl,
    'headers': {
      'Authorization': 'Bearer apa9QubZI1MOFjfvtkgFHFLF30c94U6W4-z6_7cNhKO1JteaqyG4Ys-8iSLDuG_AxDaYIdRS4yolaMtIY7qCxYRLNA_lhlyFKbTBqLx7k21g7rfXGBKpP25yzjEOYnYx'
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    res.set('Access-Control-Allow-Origin', '*');
    res.send(response.body);
  });

});


app.get("/api/getalldata", verifyToken, (req, res) => {
  // http://localhost:3000/getalldata?city=rome
  let city = req.query.city;
  let urlOpenweathermap = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.API_KEY}`;
  request(urlOpenweathermap, function (error, response, body) {
    let weather = JSON.parse(body);
    //let weather = response.body
    if (response.statusCode === 200) {

      let yelpUrl = ` https://api.yelp.com/v3/businesses/search?location=${city}`;
      var options = {
        'method': 'GET',
        'url': yelpUrl,
        'headers': {
          'Authorization': 'Bearer apa9QubZI1MOFjfvtkgFHFLF30c94U6W4-z6_7cNhKO1JteaqyG4Ys-8iSLDuG_AxDaYIdRS4yolaMtIY7qCxYRLNA_lhlyFKbTBqLx7k21g7rfXGBKpP25yzjEOYnYx'
        }
      };
      request(options, function (error, response) {
        if (error) throw new Error(error);
        let yelpBusiness = JSON.parse(response.body)
        let z = Object.assign(weather, yelpBusiness)
        //let  respAll = weather.concat(response.body);
        res.set('Access-Control-Allow-Origin', '*');
        res.send(z);
      });
    }
  });

});


app.get("/api/getmsg", function (req, res) {

  res.send("get recived!")
});
app.listen(port, () => {
   console.log(`Example app listening at Port: ${port}`)
})


function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1]
    req.token = bearerToken
    next()
  } else {

    res.sendStatus(403);
  }

}



