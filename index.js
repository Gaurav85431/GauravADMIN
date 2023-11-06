const express = require('express');
const app = express();
const http = require("http");
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
// mongoose.connect('mongodb://127.0.0.1:27017/mynewPWPP');
//mongoose.connect("mongodb+srv://Gaurav:eP2ILjAadWqdYhMda@gauravlonexcrudlogin.zshpihf.mongodb.net/?retryWrites=true&w=majority")
app.use(cors());



//user routes
const user_route = require('./routes/userRoutes');
const login_route = require('./routes/LoginRoutes');


app.use('/api', user_route);
app.use('/api', login_route);


app.get('/getapi', (req, res) => {

  res.send('server is running at render');

});


app.listen(3000, function () {
  console.log("Server is ready");
})


////


const PORT = 8000;
const DB = "mongodb+srv://Gaurav:eP2ILjAadWqdYhMda@gauravadmin.qf6wqq0.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(DB)
  .then(() => {
    console.log("Connected to MongoDB");
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`Server is running on :${PORT}`);
    });
  })
  .catch(error => {
    console.error("Error connecting to MongoDB:", error);
  });

