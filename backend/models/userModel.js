// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     profilePicture: {
//       type: String,
//       default:
//         'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
//     },
//     isAdmin: {
//       type: Boolean,
//       default: false,
//     },
//     // bio:{
//     //   type: String,
//     //   required: true,
//     // },
//   },
//   { timestamps: true }
// );

// const User = mongoose.model('User', userSchema);

// export default User;







import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      required: false, // Make it optional
      default: '',    // Default to an empty string if not provided
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
