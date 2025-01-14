import User from '../models/userModel.js';
import bcrypt from 'bcrypt'; // Use bcrypt for consistency
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer'; // Add nodemailer import

// Signup Function
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(errorHandler(400, 'All fields are required'));
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json({ status: true, message: 'Signup successful' });
  } catch (error) {
    next(error);
  }
};

// Signin Function
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, 'All fields are required'));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
    }

    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, 'Invalid password'));
    }

    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Optional: set token expiration
    );

    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Google Sign-In Function
// export const google = async (req, res, next) => {
//   const { email, name, googlePhotoUrl } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (user) {
//       const token = jwt.sign(
//         { id: user._id, isAdmin: user.isAdmin },
//         process.env.JWT_SECRET
//       );
//       const { password, ...rest } = user._doc;
//       res
//         .status(200)
//         .cookie('access_token', token, {
//           httpOnly: true,
//         })
//         .json(rest);
//     } else {
//       const generatedPassword = 
//         Math.random().toString(36).slice(-8) + 
//         Math.random().toString(36).slice(-8);
//       const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
//       const newUser = new User({
//         username: 
//           name.toLowerCase().split(' ').join('') + 
//           Math.random().toString(9).slice(-4),
//         email,
//         password: hashedPassword,
//         profilePicture: googlePhotoUrl,
//       });
//       await newUser.save();
//       const token = jwt.sign(
//         { id: newUser._id, isAdmin: newUser.isAdmin },
//         process.env.JWT_SECRET
//       );
//       const { password, ...rest } = newUser._doc;
//       res
//         .status(200)
//         .cookie('access_token', token, {
//           httpOnly: true,
//         })
//         .json(rest);
//     }
//   } catch (error) {
//     next(error);
//   }
// };

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '1d' } // Token expiration
      );
      const { password, ...rest } = user._doc;
      return res
        .status(200)
        .cookie('access_token', token, { httpOnly: true })
        .json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

      const newUser = new User({
        username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });

      await newUser.save();

      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      const { password, ...rest } = newUser._doc;

      return res
        .status(200)
        .cookie('access_token', token, { httpOnly: true })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

// Forgot Password Function
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not registered!' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5m' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      port: 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Password',
      text: `Click on the link to reset your password: http://localhost:5173/auth/resetPassword/${token}`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return res.status(500).json({ message: 'Error sending email!' });
      } else {
        return res.json({ status: true, message: 'Email sent!' });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error processing request', error: err });
  }
};

// Reset Password Function
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.id;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(id, { password: hashedPassword });
    return res.json({ status: true, message: 'Password updated successfully!' });
  } catch (err) {
    console.error('Error in resetPassword:', err);
    return res.status(400).json({ message: 'Invalid token or error updating password!' });
  }
};







// import User from '../models/userModel.js';
// import bcrypt from 'bcrypt';
// import { errorHandler } from '../utils/error.js';
// import jwt from 'jsonwebtoken';
// import nodemailer from 'nodemailer';

// // Signup Function
// export const signup = async (req, res, next) => {
//   const { username, email, password } = req.body;

//   if (!username || !email || !password) {
//     return next(errorHandler(400, 'All fields are required'));
//   }

//   const hashedPassword = bcrypt.hashSync(password, 10);

//   const newUser = new User({
//     username,
//     email,
//     password: hashedPassword,
//   });

//   try {
//     await newUser.save();
//     res.json({ status: true, message: 'Signup successful' });
//   } catch (error) {
//     next(error);
//   }
// };

// // Signin Function
// export const signin = async (req, res, next) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return next(errorHandler(400, 'All fields are required'));
//   }

//   try {
//     const validUser = await User.findOne({ email });
//     if (!validUser) {
//       return next(errorHandler(404, 'User not found'));
//     }

//     const validPassword = bcrypt.compareSync(password, validUser.password);
//     if (!validPassword) {
//       return next(errorHandler(400, 'Invalid password'));
//     }

//     const token = jwt.sign(
//       { id: validUser._id, isAdmin: validUser.isAdmin },
//       process.env.JWT_SECRET,
//       { expiresIn: '1d' } // Optional: set token expiration
//     );

//     const { password: pass, ...rest } = validUser._doc;

//     res
//       .status(200)
//       .cookie('access_token', token, {
//         httpOnly: true,
//       })
//       .json(rest);
//   } catch (error) {
//     next(error);
//   }
// };

// // Google Sign-In Function
// export const google = async (req, res, next) => {
//   const { email, name, googlePhotoUrl } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (user) {
//       const token = jwt.sign(
//         { id: user._id, isAdmin: user.isAdmin },
//         process.env.JWT_SECRET
//       );
//       const { password, ...rest } = user._doc;
//       res
//         .status(200)
//         .cookie('access_token', token, {
//           httpOnly: true,
//         })
//         .json(rest);
//     } else {
//       const generatedPassword = 
//         Math.random().toString(36).slice(-8) + 
//         Math.random().toString(36).slice(-8);
//       const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
//       const newUser = new User({
//         username: 
//           name.toLowerCase().split(' ').join('') + 
//           Math.random().toString(9).slice(-4),
//         email,
//         password: hashedPassword,
//         profilePicture: googlePhotoUrl,
//       });
//       await newUser.save();
//       const token = jwt.sign(
//         { id: newUser._id, isAdmin: newUser.isAdmin },
//         process.env.JWT_SECRET
//       );
//       const { password, ...rest } = newUser._doc;
//       res
//         .status(200)
//         .cookie('access_token', token, {
//           httpOnly: true,
//         })
//         .json(rest);
//     }
//   } catch (error) {
//     next(error);
//   }
// };

// // Forgot Password Function
// export const forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: 'User not registered!' });
//     }

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5m' });

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       secure: true,
//       port: 465,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Reset Password',
//       text: `Click on the link to reset your password: http://localhost:5173/auth/resetPassword/${token}`,
//     };

//     transporter.sendMail(mailOptions, (error) => {
//       if (error) {
//         return res.status(500).json({ message: 'Error sending email!' });
//       } else {
//         return res.json({ status: true, message: 'Email sent!' });
//       }
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error processing request', error: err });
//   }
// };

// // Reset Password Function
// export const resetPassword = async (req, res) => {
//   const { token } = req.params;
//   const { password } = req.body;

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const id = decoded.id;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     await User.findByIdAndUpdate(id, { password: hashedPassword });
//     return res.json({ status: true, message: 'Password updated successfully!' });
//   } catch (err) {
//     console.error('Error in resetPassword:', err);
//     return res.status(400).json({ message: 'Invalid token or error updating password!' });
//   }
// };



// // export const resetPassword = async (req, res) => {
//   const { token } = req.params;
//   const { password } = req.body;

//   if (!password) {
//     return res.status(400).json({ message: 'Password is required!' });
//   }

//   try {
//     // Verify the token
//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET);
//     } catch (err) {
//       return res.status(400).json({ message: 'Invalid or expired token!' });
//     }

//     const { id } = decoded;

//     // Find the user by ID
//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found!' });
//     }

//     // Hash and update the password
//     const hashedPassword = await bcrypt.hash(password, 10);
//     user.password = hashedPassword;
//     await user.save();

//     return res.json({ status: true, message: 'Password updated successfully!' });
//   } catch (err) {
//     console.error('Error in resetPassword:', err);
//     return res.status(500).json({ message: 'Error processing request', error: err.message });
//   }
// };