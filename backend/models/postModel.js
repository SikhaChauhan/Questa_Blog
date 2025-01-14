import mongoose from 'mongoose';
import Comment from './commentModel.js'; // Ensure this import matches the path to your Comment model

// Define the Post schema
const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Use ObjectId to reference User model
      ref: 'User', // Reference to User model
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default:
        'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png',
    },
    category: {
      type: String,
      default: 'uncategorized',
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    // likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likes: {
      type: [mongoose.Schema.Types.ObjectId], // Changed to Array of ObjectId for user likes
      ref: 'User',
      default: [],
    },
    numberOfLikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Use pre('findOneAndDelete') middleware to handle deletion of comments
postSchema.pre('findOneAndDelete', async function (next) {
  try {
    // Ensure 'this' is pointing to the document being deleted
    const docToDelete = await this.model.findOne(this.getQuery());
    if (docToDelete) {
      await Comment.deleteMany({ postId: docToDelete._id });
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Create the Post model
const Post = mongoose.model('Post', postSchema);

export default Post;
