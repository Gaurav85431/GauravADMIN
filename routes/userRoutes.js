const express = require('express');
const user_routes = express();

const bodyParser = require('body-parser');
user_routes.use(bodyParser.json());
user_routes.use(bodyParser.urlencoded({ extended: true }));

//
const multer = require("multer");
const path = require("path");
const auth = require('../middleware/auth');

user_routes.use(express.static('public'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images'), function (err, success) {

      if (err) {
        throw err
      }

    });
  },

  filename: function (req, file, cb) {

    const name = Date.now() + '-' + file.originalname;
    cb(null, name, function (error, success) {

      if (error) {
        throw error
      }

    });

  }
});

const upload = multer({ storage: storage });
//

const user_controller = require('../controllers/userControllers');

// Insert API::- POST

user_routes.post('/insertData', auth, upload.single('images'), user_controller.insert_data);

// UPDATE API::-  PUT

//user_routes.put('/updateData', auth, upload.single('images'), user_controller.update_data);
user_routes.put('/updateData/:id', auth, upload.single('images'), user_controller.update_data);

// Delete API::- DELETE

user_routes.delete('/deleteData/:id', auth, user_controller.delete_data);

// Get Single Data

user_routes.get('/getData/:id', auth, user_controller.get_data);

// Get All Data::
// user_routes.get('/getAllData', user_controller.get_all_data);
/** Since token is used to 1 user ko savi data ko nahi show karana hai. */

// Get Particular image based on imagename

user_routes.get('/getImages/:images', auth, user_controller.get_image);

// Get Particular image by taking id as parameter

user_routes.get('/getMyImages/:id', auth, user_controller.get_image_by_id);

module.exports = user_routes;

