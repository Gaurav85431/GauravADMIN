const express = require('express');
const user_routes = express();

const path = require('path');

const bodyParser = require('body-parser');
user_routes.use(bodyParser.json());
user_routes.use(bodyParser.urlencoded({ extended: true }));

user_routes.set('view engine', 'ejs');
user_routes.set('views', './views/users');


const login_controller = require('../controllers/LoginControllers');

const auth = require('../middleware/auth');

user_routes.post('/register', login_controller.register_user);

user_routes.post('/login', login_controller.user_login);

// change password after login
user_routes.post('/change-password', auth, login_controller.change_password);

// forgot password after login
user_routes.post('/forgot-password', login_controller.forget_password);


user_routes.get('/test', auth, function (req, res) {
  res.status(200).send({ success: true, msg: "Authenticated" })

});

//Forgot Password::

user_routes.get('/reset-password', login_controller.loadForgotForm);

user_routes.post('/reset-password', login_controller.ForgotPassword);




module.exports = user_routes;

