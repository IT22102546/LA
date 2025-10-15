// controllers/auth.controller.js
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import twilio from 'twilio';
import dotenv from "dotenv";
import nodemailer from 'nodemailer';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "projecttest088@gmail.com",
    pass: "vyzl bowj hshd apbo"
  }
});



const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
  { accountSid: process.env.TWILIO_ACCOUNT_SID }
);

// Debug check
console.log('Twilio Credentials:', {
  accountSid: process.env.TWILIO_ACCOUNT_SID ? '***' + process.env.TWILIO_ACCOUNT_SID.slice(-4) : 'MISSING',
  authToken: process.env.TWILIO_AUTH_TOKEN ? '***' + process.env.TWILIO_AUTH_TOKEN.slice(-4) : 'MISSING',
  sandboxNumber: process.env.WHATSAPP_SANDBOX_NUMBER
});

const sendEmailOtp = async (email, otp) => {
  try {
    const mailOptions = {
      from: 'Learn APP <projecttest088@gmail.com>',
      to: email,
      subject: 'Learn APP - Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6; text-align: center;">Learn APP</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #000; margin-bottom: 10px;">Password Reset Request</h3>
            <p style="color: #666; margin-bottom: 20px;">
              Use the following OTP code to reset your password. This code will expire in 10 minutes.
            </p>
            <div style="background: #fff; padding: 15px; border-radius: 8px; text-align: center; border: 2px dashed #3b82f6;">
              <h1 style="color: #3b82f6; margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
            </div>
            <p style="color: #999; font-size: 12px; margin-top: 20px;">
              If you didn't request this OTP, please ignore this email.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Email OTP sent to:', email);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

const sendWhatsAppOtp = async (mobile, otp) => {
  let formattedMobile; // Define it at the function scope
     
  try {
    const cleanMobile = mobile.replace(/\D/g, ''); 
    formattedMobile = `whatsapp:+94${cleanMobile.substring(cleanMobile.length - 9)}`; 
    
    console.log('Sending to:', formattedMobile); 

    const message = await twilioClient.messages.create({
      body: `Your Learn APP verification code: ${otp}. This code will expire in 10 minutes.`,
      from: `whatsapp:${process.env.WHATSAPP_SANDBOX_NUMBER}`,
      to: formattedMobile
    });

    console.log('WhatsApp OTP sent. SID:', message.sid);
    return true;
  } catch (error) {
    console.error('WhatsApp Error Details:', {
      inputMobile: mobile,
      formattedMobile: formattedMobile || 'Not defined', // Use the scoped variable
      error: error.message,
      code: error.code
    });
    throw new Error(`Failed to send WhatsApp: ${error.message}`);
  }
};
export const requestMobileVerification = async (req, res, next) => {
  const { mobile } = req.body;

  if (!mobile) {
    return next(errorHandler(400, 'Mobile number is required'));
  }

  try {
    // Check if mobile already registered (excluding temp users)
    const existingUser = await User.findOne({ 
      mobile, 
      isVerified: true 
    });
    
    if (existingUser) {
      return next(errorHandler(400, 'Mobile number already registered'));
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Find or create temporary user
    let user = await User.findOne({ mobile, isVerified: false });
    
    if (user) {
      // Update existing temp user
      user.otp = otp;
      user.otpExpires = otpExpires;
    } else {
      // Create new temp user
      user = new User({
        mobile,
        otp,
        otpExpires,
        isVerified: false
      });
    }

    await user.save({ validateBeforeSave: false });

    // Send OTP via WhatsApp
    await sendWhatsAppOtp(mobile, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      tempUserId: user._id,
      otpExpires: otpExpires
    });

  } catch (error) {
    console.error('Mobile verification error:', error);
    next(errorHandler(500, 'Failed to send OTP'));
  }
};

export const verifyMobileWithOtp = async (req, res, next) => {
  const { mobile, otp, tempUserId } = req.body;

  if (!mobile || !otp) {
    return next(errorHandler(400, 'Mobile and OTP are required'));
  }

  try {
    const user = await User.findOne({
      _id: tempUserId,
      mobile,
      otp,
      otpExpires: { $gt: new Date() }
    });

    if (!user) {
      return next(errorHandler(400, 'Invalid or expired OTP'));
    }

    // Mark as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    // Generate temporary token for signup completion
    const tempToken = jwt.sign(
      { id: user._id, temp: true },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      message: "Mobile number verified successfully",
      tempToken,
      tempUserId: user._id
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    next(errorHandler(500, 'Verification failed'));
  }
};

export const completeSignup = async (req, res, next) => {
  const {
    mobile,
    email,
    fullName,
    dob,
    userType,
    district,
    zone,
    grade,
    school,
    medium,
    institution,
    password
  } = req.body;

  try {
    // Validate required fields
    if (!email || !fullName || !dob || !userType || !password) {
      return next(errorHandler(400, "All required fields must be filled"));
    }

    // Generate username from full name
    const generateUsername = (fullName) => {
      const baseUsername = fullName
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, '')
        .replace(/\s+/g, '');
      
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      return `${baseUsername}${randomSuffix}`;
    };

    const username = generateUsername(fullName);

    // Check if username, email, or mobile already exists
    const existingUser = await User.findOne({
      $or: [
        { email }, 
        { username },
        ...(mobile ? [{ mobile }] : [])
      ]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return next(errorHandler(400, "Email already registered"));
      }
      if (existingUser.username === username) {
        return next(errorHandler(400, "Username already taken"));
      }
      if (existingUser.mobile === mobile) {
        return next(errorHandler(400, "Mobile number already registered"));
      }
    }

    // Validate password
    if (password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters"));
    }

    // Hash password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      mobile,
      fullName,
      dob: new Date(dob),
      userType,
      district,
      zone,
      grade,
      school,
      medium,
      institution,
      password: hashedPassword,
      isVerified: true
    });

    await newUser.save();

    // Return success response without token or auto-signin
    res.status(201).json({
      success: true,
      message: "Signup completed successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        username: newUser.username
      }
    });

  } catch (error) {
    console.error('Complete signup error:', error);
    next(errorHandler(500, "Signup failed"));
  }
};



export const signin = async(req, res, next) => {
  const {email, password} = req.body;
  if(!email || !password || email==="" || password===""){
    next(errorHandler(400,"All fields are required"));
  }
  try{
    const validUser = await User.findOne({email});
    if(!validUser) return next(errorHandler(404,'User not found!'));
    const validPassword = bcryptjs.compareSync(password,validUser.password);
    if(!validPassword) return next(errorHandler(400,'Invalid Credentials!'));
    const token = jwt.sign({id:validUser._id , isAdmin:validUser.isAdmin},process.env.JWT_SECRET);
    const{password:hashedPassword, ...rest} = validUser._doc;
    const expiryDate = new Date(Date.now()+3600000);
    res.cookie('access_token',token,{httpOnly:true,expires:expiryDate}).status(200).json(rest);
  }catch(error){
    next(error);
  }
}

export const mobileSignin = async(req, res, next) => {
  console.log('Signin request received:', req.body); 
  
  const {email, password} = req.body;
  if(!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({email});
    console.log('Found user:', validUser ? validUser.email : 'No user found');
    
    if(!validUser) return next(errorHandler(404, 'User not found!'));
    
    // Use the model's matchPassword method
    const validPassword = await validUser.matchPassword(password);
    console.log('Password comparison result:', validPassword);
    
    if(!validPassword) return next(errorHandler(400, 'Invalid Credentials!'));
    
    const token = jwt.sign(
      {id: validUser._id, isAdmin: validUser.isAdmin}, 
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    const userData = validUser.toObject();
    delete userData.password;
    delete userData.verifytoken;
    
    res.status(200).json({
      success: true,
      token,
      user: userData
    });
    
  } catch(error) {
    console.error('Signin error:', error); 
    next(error);
  }
}

export const requestOtp = async (req, res, next) => {
  const { mobile } = req.body;

  if (!mobile) {
    return next(errorHandler(400, 'Mobile number is required'));
  }

  try {
    const user = await User.findOne({ mobile });
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    const otp = otpGenerator.generate(4, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false
    });

    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    try {
      await sendWhatsAppOtp(mobile, otp);
      
      res.status(200).json({
        success: true,
        message: 'OTP sent via WhatsApp',
        instruction: `If you don't see the message, send "${process.env.WHATSAPP_SANDBOX_PHRASE}" to ${process.env.WHATSAPP_SANDBOX_NUMBER} first`,
        mobile: mobile.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2')
      });
    } catch (error) {
      console.error('WhatsApp sending failed:', error);
      return next(errorHandler(500, 'Failed to send OTP via WhatsApp'));
    }

  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  const { mobile, otp } = req.body;
  
  console.log('Verification request received:', {
    mobile,
    otp,
    time: new Date().toISOString()
  });

  if (!mobile || !otp) {
    console.log('Missing required fields');
    return next(errorHandler(400, 'Mobile number and OTP are required'));
  }

  if (typeof otp !== 'string' || otp.length !== 4) {
    console.log('Invalid OTP format');
    return next(errorHandler(400, 'Invalid OTP format'));
  }

  try {
    const user = await User.findOne({ mobile });

    if (!user) {
      console.log('User not found for mobile:', mobile);
      return next(errorHandler(404, 'User not found'));
    }

    console.log('OTP Verification Details:', {
      storedOtp: user.otp,
      inputOtp: otp,
      currentTime: new Date().toISOString(),
      expiryTime: user.otpExpires?.toISOString(),
      isExpired: user.otpExpires && new Date() > new Date(user.otpExpires)
    });

    if (!user.otp || !user.otpExpires) {
      console.log('No active OTP found for user');
      return next(errorHandler(400, 'No active OTP found'));
    }

    if (user.otp.toString().trim() !== otp.toString().trim()) {
      console.log('OTP mismatch');
      return next(errorHandler(400, 'Invalid OTP code'));
    }

    if (new Date() > new Date(user.otpExpires)) {
      console.log('OTP expired');
      return next(errorHandler(410, 'OTP has expired. Please request a new one'));
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign(
      { 
        id: user._id, 
        isAdmin: user.isAdmin,
        mobile: user.mobile
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userData = user.toObject();
    delete userData.password;
    delete userData.otp;
    delete userData.otpExpires;
    delete userData.verifytoken;

    console.log('OTP verification successful for user:', user._id);

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      token,
      user: userData,
      expiresIn: 24 * 60 * 60
    });

  } catch (error) {
    console.error('OTP Verification Error:', {
      error: error.message,
      stack: error.stack,
      time: new Date().toISOString()
    });
    next(errorHandler(500, 'Internal server error during OTP verification'));
  }
};

// controllers/auth.controller.js - Add this new function


export const checkAccountExists = async (req, res, next) => {
  const { emailOrPhone } = req.body;

  if (!emailOrPhone) {
    return next(errorHandler(400, 'Email or phone number is required'));
  }

  try {
    // Check if it's an email or phone number
    const isEmail = emailOrPhone.includes('@');
    let user = null;

    if (isEmail) {
      // Check by email
      user = await User.findOne({ 
        email: emailOrPhone.toLowerCase(),
        isVerified: true 
      });
    } else {
      // Check by mobile number - try multiple formats
      const cleanMobile = emailOrPhone.replace(/\D/g, '');
      
      // Try different mobile number formats
      user = await User.findOne({
        $or: [
          { mobile: cleanMobile },
          { mobile: `94${cleanMobile.substring(cleanMobile.length - 9)}` },
          { mobile: `+94${cleanMobile.substring(cleanMobile.length - 9)}` },
          { mobile: `0${cleanMobile.substring(cleanMobile.length - 9)}` }
        ],
        isVerified: true
      });
    }

    if (!user) {
      return res.status(200).json({
        success: false,
        exists: false,
        message: isEmail ? 'No account found with this email' : 'No account found with this phone number'
      });
    }

    res.status(200).json({
      success: true,
      exists: true,
      message: 'Account found',
      userType: user.userType,
      isEmail: isEmail,
      userId: user._id
    });

  } catch (error) {
    console.error('Check account error:', error);
    next(errorHandler(500, 'Failed to check account'));
  }
};

// Send OTP for password reset
export const sendPasswordResetOtp = async (req, res, next) => {
  const { emailOrPhone, isEmail } = req.body;

  console.log('🔴 SEND OTP CALLED - Request received:', { 
    emailOrPhone, 
    isEmail,
    timestamp: new Date().toISOString(),
    source: 'password-reset'
  });

  if (!emailOrPhone || isEmail === undefined) {
    return next(errorHandler(400, 'Email/phone and type are required'));
  }

  try {
    let user;
    
    if (isEmail === 'true' || isEmail === true) {
      user = await User.findOne({ 
        email: emailOrPhone.toLowerCase(),
        isVerified: true 
      });
      console.log('📧 Email user search result:', user ? 'Found' : 'Not found');
    } else {
      const cleanMobile = emailOrPhone.replace(/\D/g, '');
      
      user = await User.findOne({
        $or: [
          { mobile: cleanMobile },
          { mobile: `94${cleanMobile.substring(cleanMobile.length - 9)}` },
          { mobile: `+94${cleanMobile.substring(cleanMobile.length - 9)}` },
          { mobile: `0${cleanMobile.substring(cleanMobile.length - 9)}` }
        ],
        isVerified: true
      });
      console.log('📱 Mobile user search result:', user ? 'Found' : 'Not found');
    }

    if (!user) {
      console.log('❌ User not found');
      return next(errorHandler(404, 'User not found'));
    }

    console.log('✅ User found for OTP:', {
      userId: user._id,
      mobile: user.mobile,
      email: user.email
    });

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    console.log('🔢 Generated OTP:', otp);

    // Save OTP to user
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save({ validateBeforeSave: false });

    let sendResult;
    let sendMethod;
    
    if (isEmail === 'true' || isEmail === true) {
      console.log('📤 Sending email OTP to:', emailOrPhone);
      sendResult = await sendEmailOtp(emailOrPhone, otp);
      sendMethod = 'email';
    } else {
      const mobileToSend = user.mobile;
      console.log('📤 Sending WhatsApp OTP to:', mobileToSend);
      sendResult = await sendWhatsAppOtp(mobileToSend, otp);
      sendMethod = 'WhatsApp';
    }

    console.log('✅ OTP sent successfully via:', sendMethod);

    res.status(200).json({
      success: true,
      message: `OTP sent successfully via ${sendMethod}`,
      emailOrPhone: isEmail ? emailOrPhone : emailOrPhone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2'),
      otpExpires: otpExpires,
      isEmail: isEmail,
      userId: user._id
    });

  } catch (error) {
    console.error('❌ Send OTP error:', error);
    next(errorHandler(500, `Failed to send OTP: ${error.message}`));
  }
};

// Verify OTP for password reset
// Update the mobile part in verifyPasswordResetOtp function
export const verifyPasswordResetOtp = async (req, res, next) => {
  const { emailOrPhone, isEmail, otp } = req.body;

  if (!emailOrPhone || !otp || isEmail === undefined) {
    return next(errorHandler(400, 'Email/phone, OTP and type are required'));
  }

  try {
    let user;
    
    if (isEmail === 'true' || isEmail === true) {
      user = await User.findOne({ 
        email: emailOrPhone.toLowerCase(),
        isVerified: true 
      });
    } else {
      // Find by mobile - try multiple formats
      const cleanMobile = emailOrPhone.replace(/\D/g, '');
      
      user = await User.findOne({
        $or: [
          { mobile: cleanMobile },
          { mobile: `94${cleanMobile.substring(cleanMobile.length - 9)}` },
          { mobile: `+94${cleanMobile.substring(cleanMobile.length - 9)}` },
          { mobile: `0${cleanMobile.substring(cleanMobile.length - 9)}` }
        ],
        isVerified: true
      });
    }

    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    console.log('OTP Verification for user:', {
      userId: user._id,
      storedMobile: user.mobile,
      storedOtp: user.otp,
      inputOtp: otp,
      expiry: user.otpExpires,
      currentTime: new Date()
    });

    // Check if OTP exists and is not expired
    if (!user.otp || !user.otpExpires) {
      return next(errorHandler(400, 'No active OTP found. Please request a new one.'));
    }

    if (new Date() > user.otpExpires) {
      return next(errorHandler(410, 'OTP has expired. Please request a new one.'));
    }

    if (user.otp !== otp) {
      return next(errorHandler(400, 'Invalid OTP code. Please try again.'));
    }

    // OTP is valid - clear it and generate reset token
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    // Generate password reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { 
        id: user._id, 
        type: 'password_reset' 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      resetToken,
      userId: user._id
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    next(errorHandler(500, 'Failed to verify OTP'));
  }
};

// Add to controllers/auth.controller.js

// Verify reset token
export const verifyResetToken = async (req, res, next) => {
  const { resetToken } = req.body;

  if (!resetToken) {
    return next(errorHandler(400, 'Reset token is required'));
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    
    if (decoded.type !== 'password_reset') {
      return next(errorHandler(400, 'Invalid reset token'));
    }

    // Check if user exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    res.status(200).json({
      success: true,
      message: 'Reset token is valid',
      userId: user._id
    });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(errorHandler(410, 'Reset token has expired. Please request a new one.'));
    } else if (error.name === 'JsonWebTokenError') {
      return next(errorHandler(400, 'Invalid reset token'));
    }
    console.error('Verify reset token error:', error);
    next(errorHandler(500, 'Failed to verify reset token'));
  }
};

// Reset password
export const resetPassword = async (req, res, next) => {
  const { resetToken, newPassword, confirmPassword } = req.body;

  if (!resetToken || !newPassword || !confirmPassword) {
    return next(errorHandler(400, 'All fields are required'));
  }

  if (newPassword !== confirmPassword) {
    return next(errorHandler(400, 'Passwords do not match'));
  }

  if (newPassword.length < 6) {
    return next(errorHandler(400, 'Password must be at least 6 characters long'));
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    
    if (decoded.type !== 'password_reset') {
      return next(errorHandler(400, 'Invalid reset token'));
    }

    // Check if user exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    // Hash new password
    const hashedPassword = bcryptjs.hashSync(newPassword, 10);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    // Invalidate any existing OTP data
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(errorHandler(410, 'Reset token has expired. Please request a new OTP.'));
    } else if (error.name === 'JsonWebTokenError') {
      return next(errorHandler(400, 'Invalid reset token'));
    }
    console.error('Reset password error:', error);
    next(errorHandler(500, 'Failed to reset password'));
  }
};