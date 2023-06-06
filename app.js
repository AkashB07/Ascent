//To keep secure variable or keys out of the project
const dotnev = require('dotenv');
dotnev.config();

const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

//To enable browser to acess resourse
app.use(cors());

//To parse the incoming request
app.use(express.json());

//Routes
const scheduleRoutes = require('./routes/schedule');

//Routers
app.use('/schedule', scheduleRoutes);

//To redirect different routes to view (http://localhost:3000/home.html)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, `view/${req.url}`))
});

// For connecting with NoSQL Database
mongoose
  .connect(
    //Database Credientials keept in .env file
    process.env.DB_DETAILS
  )
  .then(() => {
    //Listens to the connecton on specified port
    app.listen(3000);
  })
  .catch(error => {
    console.log(error)
  })

