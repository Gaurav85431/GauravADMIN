const user = require('../models/LoginModel');
const bcyptjs = require('bcryptjs');

const config = require('../config/config');

// const bcrypt = require('bcryptjs'); // This is used in change password

const jwt = require('jsonwebtoken');

const nodemailer = require('nodemailer');
const randomstring = require('randomstring');



const create_token = async (id) => {
  try {
    const token = await jwt.sign({ _id: id }, config.secret_jwt);
    return token;
  }
  catch (error) {
    res.status(400).send(error.message);
  }
}


const securePassword = async (password) => {

  try {
    const passwordHash = await bcyptjs.hash(password, 10);
    return passwordHash;
  }
  catch (error) {
    res.status(400).send(error.message);
  }

}


const register_user = async (req, res) => {

  try {


    const spassword = await securePassword(req.body.password);


    const users = new user({
      name: req.body.name,
      email: req.body.email,
      password: spassword,

      mobile: req.body.mobile,

      type: req.body.type
    });

    const userData = await user.findOne({ email: req.body.email });
    if (userData) {

      res.status(200).send({ success: false, msg: "This email is already exists" });
    }
    else {

      const user_data = await users.save();
      res.status(200).send({ success: true, data: user_data });
    }
  }
  catch (error) {
    //console.log(error.message);
    res.status(400).send(error.message);
  }

}

// Log in method::::::

const user_login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await user.findOne({ email: email });

    if (userData) {
      const passwordMatch = await bcyptjs.compare(password, userData.password);

      // userData.password is a hashing password

      if (passwordMatch) {

        const tokenData = await create_token(userData._id);

        const userResult = {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          password: userData.password,

          mobile: userData.mobile,
          type: userData.type,
          token: tokenData
        }
        const response = {
          success: true,
          msg: "User Details",
          data: userResult
        }
        res.status(200).send(response);

      }
      else {
        res.status(200).send({ success: false, msg: "Login details are incorrect" });
      }
    }
    else {
      res.status(200).send({ success: false, msg: "Login details are incorrect" });
    }

  }
  catch (error) {
    res.status(400).send(error.message)
  }
}

// Forgot Password:::---
/*
const change_password = async (req, res) => {

  try {

    // Take old Password
    const oldPW = req.body.oldPW;
    // convert old passowrd in hash

    // const oldHashPW = await securePassword(oldPW);
    // But this will generate the new hash code  of password

    // so we will decrypt the old password hash code in  original password

    // match old password with database
    // const oldPWchk = await user.findOne({ password: oldHashPW });

    const token = req.query.token;
    const tokenMatch = await user.findOne({ token: token });

    if (tokenMatch) {

      const user_ID = await tokenMatch._id;
      const oldPassWordHASH = await tokenMatch.password;

      console.log(oldPassWordHASH);

      const oldPassword = req.body.oldPassword;

      const MyPasswordInDB = await user_ID.password;

         bcrypt.compare(oldPassword, oldPassWordHASH);

         /*
      // bcrypt.compare(oldPassword, oldPassWordHASH, function (error, result) {


        if (oldPassword != oldPassWordHASH) {
          res.send("Incorrect Password");
        }
        else {

          const newPW = req.body.newPW;
          const confirmPW = req.body.confirmPW;

          if (newPW === confirmPW) {
            const spassword = securePassword(req.body.confirmPW);

            const NewPassword = new user({

              password: spassword

            })

            const ChangedPW = NewPassword.save();
            res.status(200).send("Password changed Successfully");


          }
          else {
            res.send("New and Confirm Password not match");
          }


        }



*/
// if (error) {

//   res.send("Incorrect Password");

// }
// else if (result) {


//   const newPW = req.body.newPW;
//   const confirmPW = req.body.confirmPW;

//   if (newPW === confirmPW) {
//     const spassword = securePassword(req.body.confirmPW);

//     const NewPassword = new user({

//       password: spassword

//     })

//     const ChangedPW = NewPassword.save();
//     res.status(200).send("Password changed Successfully");


//   }

//   else {
//     res.send("New and Confirm Password not match");
//   }




// }
// else {
//   res.send("It might Internal Server Error");
// }


//     });

// }




// const oldPWchk = await user.findOne({ password: oldPW });
/*
      // if (oldPWchk) {
/*
      const newPW = req.body.newPW;
      const confirmPW = req.body.confirmPW;
 
      if (newPW === confirmPW) {
        const spassword = await securePassword(req.body.confirmPW);
 
        const NewPassword = new user({
 
          password: spassword
 
        })
 
        const ChangedPW = await NewPassword.save();
        res.status(200).send("Password changed Successfully");
 
 
      }
      else{
        res.send("New and Confirm Password not match");
      }
 
      
    // }
    else {
      res.send("Old Password is incorrect");
    }
*/
/*
  } catch (error) {
    res.status(400).send(error.message);
  }


}
*/


const change_password = async (req, res) => {

  try {

    const token = req.query.token;
    const tokenMatch = await user.findOne({ token: token });

    if (tokenMatch) {

      //const userName = await tokenMatch.name;
      //console.log(userName);
      // const user_ID = await user._id;
      // const oldPassWordHASH = await tokenMatch.password; // daabase ke pw
      // console.log(user_ID);
      // console.log(user);
      // console.log(oldPassWordHASH);

      const user_ID = await tokenMatch._id;


      const oldPassword = req.body.oldPW; //old pass

      console.log(tokenMatch.password);

      const passwordMatch = await bcyptjs.compare(oldPassword, tokenMatch.password);
      // const passwordMatch = true;


      if (passwordMatch) {

        const newPW = req.body.newPW;
        const confirmPW = req.body.confirmPW;



        if (newPW === confirmPW) {



          const spassword = await securePassword(confirmPW);
          // console.log(spassword);
          const savePassword = await user.findByIdAndUpdate({ _id: user_ID }, { $set: { password: spassword } }, { new: true });

          /*  // update logic by me
         const findid = await user.findOne({ _id: user_ID });
         console.log("FINDID" + findid);
         const updatePW = await findid.updateOne({ $set: { password: spassword } });
         console.log(updatePW + "UPDATEPASS");
         */


          res.status(200).send({ success: true, msg: "Your password has been changed Successfully" });



        }
        else {

          res.status(400).send({ success: false, msg: "New and Confirm Password not match" });
        }



      }
      else {
        res.status(400).send("Old Password not match")
      }


    }



  } catch (error) {
    res.send(error.message);
  }

}

// sending mail function


const sendResetPasswordMail = async (name, email, token) => {

  try {

    const transporter = nodemailer.createTransport({

      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: config.emailUser,
        pass: config.emailPassword
      }
    });

    const mailOption = {
      from: config.emailUser,
      to: email,   //wo email me mail send hoga jo ki pass hoke aaya hai async fun me
      subject: "For Reset Password",
      html: '<p> Hii ' + name + ', Please click the link and <a href="http://127.0.0.1:3000/api/reset-password"> reset your password </a>'
    }
    transporter.sendMail(mailOption, function (error, info) {

      if (error) {
        console.log(error);
      }
      else {
        console.log("Mail has been sent:- " + info.response);
      }

    })

  } catch (error) {

    console.log(error);
    // res.status(400).send({ success: false, msg: error.message });
  }

}



// sending mail function end


// --
//  Forgot Password:::--
const forget_password = async (req, res) => {

  try {

    const email = req.body.email;

    const userData = await user.findOne({ email: email });


    if (userData) {


      const randomString = randomstring.generate();  // token
      const data = await user.updateOne({ email: email }, { $set: { token: randomString } });
      sendResetPasswordMail(userData.name, userData.email, randomString);
      res.status(200).send({ success: true, msg: "please check your email and reset password" })


    }
    else {
      res.status(200).send({ success: true, msg: "This email does not exists" });
    }

  } catch (error) {
    res.status(200).send({ success: false, msg: error.message });
  }

}



/**  Here code to send forgot password page to user on browser */

const loadForgotForm = async (req, res) => {

  try {
    res.render('feedback');
  }
  catch (error) {
    console.log(error.message);
  }
}


/**  */

const ForgotPassword = async (req, res) => {


  try {
    console.log("1");
    const email = req.body.email;
    console.log(email);
    console.log("2");
    // const myData = await user.findOne({ email: email });

    // if (myData) {
    console.log("3");
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;
    console.log(confirmPassword);
    console.log(newPassword);
    console.log("4");
    /*
        const saveNewPassword = new user({
    
          email: email,
          newPassword: newPassword ,
          confirmPassword:confirmPassword
    
        });
        // console.log(req.body);
        // const user_data = await saveNewPassword.save();
    */

    console.log("5");

    if (newPassword === confirmPassword) {
      console.log("6");
      /*
      const saveNewPassword = new user({

        email: email,
        newPassword: newPassword,
        confirmPassword: confirmPassword

      });
      */
      console.log("7");
      // pw hash
      //  const spassword = await securePassword(confirmPassword);

      console.log("8");
      // find id of user
      console.log("9");
      console.log(email);

      //      const myData = await user.find();//One({ email: email });
      const myData = await user.find().lean();

      console.log("10");
      console.log(myData);
      const myId = await myData.findOne({ email: email }).lean();//_id;
      console.log("11");
      console.log(myId);

      //  if (myData) {

      // update password
      console.log("12");
      const userData = await user.findByIdAndUpdate({ _id: myId }, {
        $set: { email: email, password: newPassword }
      });
      console.log(userData);
      console.log("13");
      res.render('feedback', { message: "New Password set" });

      console.log("14");
      /*  }
        else {
          res.render('feedback',{message:"Email doesn't exist"});
          
        }*/


    }
    else {

      res.render('feedback', { message: "New password and confirmPassword not match" });


    }
    /*  }
      else {
        
         res.render('feedback', { message: "Email doesn't exist" });
      }
      */

  } catch (error) {
    console.log("45");
    console.log(error.message);
    res.send(error);
  }

}



module.exports = {
  register_user,
  user_login,
  change_password,
  forget_password,
  loadForgotForm,
  ForgotPassword

}