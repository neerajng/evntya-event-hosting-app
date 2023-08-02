const User = require('../models/User');
const Event = require('../models/Event');
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generate')
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config()


const signupCtrl =  async (req, res) => {
    try {
      
      const { firstName, lastName, email, password } = req.body;

      // Check for empty fields
      if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ success: false, error: 'Please fill in all fields' });
      }

      // Validate email format
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
      }
      
      //Find user is existing
      const existingUser = await User.findOne({
        $or: [{ email }, { firstName, lastName }],
      });

      // If user is already verified, return error
      if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ success: false, error: 'User already exists' });
      }

      // Generate a salt to use for password hashing
      const salt = await bcrypt.genSalt(10);

      // Generate an OTP
      const otp = otpGenerator(6);

      // Send OTP via email
      const otpMailSent = async (recipientEmail, otp) => {
        try {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            })
            const mailOptions = {
                from: `"Evntya <${process.env.EMAIL}>`,
                to: recipientEmail,
                subject: "Do Not Reply - Email Verification ✔️",
                text: `Your OTP is: ${otp}`
            }
            const info = await transporter.sendMail(mailOptions)
            console.log('Email sent:', info.response , otp);
            return 
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    if (!existingUser) {
      // If user does not exist, create and save the user
      const hashedPassword = await bcrypt.hash(password, salt);
    
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        mailOtp: otp,
        isVerified: false
      });


      // Save the user to the database
      const savedUser = await newUser.save();      
      

      res.status(201).json({user: savedUser });
      // Send OTP email and save the user with OTP
      await otpMailSent(email, otp);

    }  else {
      // If user exists but is not verified, update the entire data including password hashing
      const hashedPassword = await bcrypt.hash(password, salt);
    
      // Update the user's data
      Object.assign(existingUser, {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        mailOtp: otp,
        isVerified: false
      });
    
      const updatedUser = await existingUser.save();    
      
      res.status(200).json({ user: updatedUser });
      // Send OTP email to the existing user
      await otpMailSent(email, otp);
    }

    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
};


const verifyOtpCtrl = async (req, res) => {
  try {    
    const { otp, signupResponse } = req.body;
    console.log(otp)
    const mailOtp = await signupResponse.mailOtp;
    console.log(mailOtp);

    if (!otp) {
      return res.status(400).json({ success: false, error: 'Please enter the otp' });
    }

    // Check if the OTP matches
    if (otp === mailOtp) {
      // Update the user's isVerified status to true
      // Find the user by email and update the isVerified field
      const verifiedUser = await User.findOneAndUpdate(
        { mailOtp: mailOtp },
        { isVerified: true },
        { new: true }
      );
      console.log(verifiedUser);
      return res.status(200).json({ success: true, message: 'Evntya account created successfully ' });  
    } else {      
      return res.status(400).json({ success: false, error: 'OTP mismatched' });
    }

  } catch (error) {
    // Handle any other errors
    console.error(error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

const signinCtrl = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please fill in all fields' });
      }

    // Check if the user with the provided email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Check if the user is blocked
    if (user.isBlocked) {
      return res.status(403).json({ error: 'You have been blocked' });
    }

    const userPwd = user.password
    console.log(userPwd)
    if(!userPwd){
      return res.status(401).json({ error: 'You must sign in with Google' });
    }
    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

     // Store the user's ID in the session
     req.session.userId = user._id;
    //  req.session.role = email === adminEmail ? 'admin' : 'user';

     console.log(req.session)

    // Generate JWT token for authentication
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.SECRET_KEY,
      {
        expiresIn: "2h"
      }
      );
    console.log(token)  
    // Return the token to the client
    res.json({ token });
  } catch (error) {
    console.error('Sign-in error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const forgetCtrl = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!email ) {
      return res.status(400).json({ error: 'Please enter your email address' });
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!user) {
      return res.status(400).json({ error: 'Email not found' });
    }

    // Generate a unique token for the password reset request
    const token = crypto.randomBytes(20).toString('hex');

    // Store the token and the time of the request in the database
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
      }
  })
    const frontendHost = process.env.FRONTEND_HOST;
    // Send an email to the user with the password reset link
    const resetURL = `http://${frontendHost}/test/reset-password/${token}`;
    const mailOptions = {
      to: email,
      from: process.env.EMAIL,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\n${resetURL}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'An email has been sent to your email address with further instructions.' });    

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetCtrl = async (req, res) => {
  try {
  const { password, token } = req.body;
  if (!password || !token) {
    return res.status(400).json({ error: 'Please provide a new password and a valid token' });
  }
  const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
  
  if (!user) {
    return res.status(400).json({ error: 'Password reset token is invalid or has expired' });
  }
  const saltRounds = 10;
  // Hash the password before storing it in the database
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.status(200).json({ message: 'Your password has been successfully reset' });
}
catch (error) {
  res.status(500).json({ message: error.message });
}
};

const googleSigninCtrl = async (req, res) => {
  try {
    console.log("1000")
    res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
    const { client_id, jwtToken } = req.body;

    // Verify the ID token and extract user data from the payload
    const payload = await verifyGoogle(client_id, jwtToken);
    const email = payload['email'];
    const name = payload['name'];
    const picture = payload['picture'];
    const given_name = payload['given_name'];
    const family_name = payload['family_name'];
    // ...
    console.log(email,picture,given_name, family_name)

    // Check if the user with the provided email exists
    let user = await User.findOne({ email });
    if (!user) {
      // Create a new user record if it doesn't exist
      user = new User({
        firstName: given_name,
        lastName: family_name,
        email: email,
        picture: picture,
        isVerified: true
      });
      await user.save();
    } else {
      // Check if the user is blocked
      console.log(user.isBlocked)
      if (user.isBlocked) {
        return res.status(403).json({ error: 'You have been blocked' });
      }
      // Update the existing user record with the new data
      user.firstName = given_name;
      user.lastName = family_name;
      user.picture = picture;
      user.isVerified = true;
      await user.save();
    }

    // Store the user's ID in the session
    req.session.userId = user._id;

    // Generate JWT token for authentication
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.SECRET_KEY,
      {
        expiresIn: "2h"
      }
    );

    // Return the token to the client
    res.json({ token, email });
  } catch (error) {
    console.error('Google sign-in error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const verifyGoogle = async (client_id, jwtToken) => {
  try{
    const client = new OAuth2Client(client_id);
    // Call the verifyIdToken to
    // verify and decode it
    const ticket = await client.verifyIdToken({
        idToken: jwtToken,
        audience: client_id,
    });
    // Get the JSON with all the user info
    const payload = ticket.getPayload();
    // This is a JSON object that contains
    // all the user info
    return payload;
  } catch(error){
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }  
};


  module.exports = {
    signupCtrl,
    verifyOtpCtrl,
    signinCtrl,
    forgetCtrl,
    resetCtrl,
    verifyGoogle,
    googleSigninCtrl 
  };
