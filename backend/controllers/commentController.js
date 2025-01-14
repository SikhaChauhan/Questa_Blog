import Comment from '../models/commentModel.js';
import Post from '../models/postModel.js'; // Import Post model
import { errorHandler } from '../utils/error.js';

// Create a new comment
export const createComment = async (req, res, next) => {
  try {
    const { content, postId } = req.body;
    const userId = req.user.id;

    if (userId !== req.user.id) {
      return next(errorHandler(403, 'You are not allowed to create this comment'));
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    await newComment.save();

    // Populate the new comment with user and post details
    const populatedComment = await Comment.findById(newComment._id)
      .populate('userId', 'profilePicture username')
      .populate({
        path: 'postId',
        select: 'title slug image', // Include title, slug, and image
      })
      .exec();

    // Construct the post URL
    if (populatedComment.postId) {
      populatedComment.postId.url = `/posts/${populatedComment.postId.slug}`;
    }

    res.status(200).json(populatedComment);
  } catch (error) {
    next(error);
  }
};


export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate('userId', 'profilePicture username')
      .populate({
        path: 'postId',
        select: 'title slug image', // Include title, slug, and image
      })
      .sort({ createdAt: -1 })
      .exec();

    // Construct the post URL for each comment
    comments.forEach(comment => {
      if (comment.postId) {
        comment.postId.url = `/posts/${comment.postId.slug}`;
      }
    });

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};




export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, 'Comment not found'));
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();

    // Populate the updated comment with user and post details
    const populatedComment = await Comment.findById(comment._id)
      .populate('userId', 'profilePicture username')
      .populate({
        path: 'postId',
        select: 'title slug image', // Include title, slug, and image
      })
      .exec();

    // Construct the post URL
    if (populatedComment.postId) {
      populatedComment.postId.url = `/posts/${populatedComment.postId.slug}`;
    }

    res.status(200).json(populatedComment);
  } catch (error) {
    next(error);
  }
};

// Edit an existing comment
export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, 'Comment not found'));
    }
    if (comment.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to edit this comment'));
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true }
    )
    .populate('userId', 'profilePicture username')
    .populate({
      path: 'postId',
      select: 'title slug image', // Include title, slug, and image
    })
    .exec();

    // Construct the post URL
    if (editedComment.postId) {
      editedComment.postId.url = `/posts/${editedComment.postId.slug}`;
    }

    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
};

// Delete a comment
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, 'Comment not found'));
    }
    if (comment.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to delete this comment'));
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json('Comment has been deleted');
  } catch (error) {
    next(error);
  }
};

// Get all comments (admin only)
// export const getComments = async (req, res, next) => {
//   if (!req.user.isAdmin) {
//     return next(errorHandler(403, 'You are not allowed to get all comments'));
//   }
//   try {
//     const startIndex = parseInt(req.query.startIndex) || 0;
//     const limit = parseInt(req.query.limit) || 9;
//     const sortDirection = req.query.sort === 'desc' ? -1 : 1;

//     const comments = await Comment.find()
//       .populate('userId', 'profilePicture username')
//       .populate({
//         path: 'postId',
//         select: 'title slug image', // Include title, slug, and image
//       })
//       .sort({ createdAt: sortDirection })
//       .skip(startIndex)
//       .limit(limit)
//       .exec();
    
//     // Construct the post URL for each comment
//     comments.forEach(comment => {
//       if (comment.postId) {
//         comment.postId.url = `/posts/${comment.postId.slug}`;
//       }
//     });

//     const totalComments = await Comment.countDocuments();
//     const now = new Date();
//     const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
//     const lastMonthComments = await Comment.countDocuments({ createdAt: { $gte: oneMonthAgo } });
    
//     res.status(200).json({ comments, totalComments, lastMonthComments });
//   } catch (error) {
//     next(error);
//   }
// };



export const getComments = async (req, res, next) => {
  // Check if user is admin
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to get all comments'));
  }
  
  try {
    // Parse query parameters
    const startIndex = parseInt(req.query.startIndex, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 9;
    const sortDirection = req.query.sort === 'desc' ? -1 : 1;
    
    // Fetch comments with pagination, sorting, and population
    const comments = await Comment.find()
      .populate('userId', 'profilePicture username') // Populate user details
      .populate({
        path: 'postId',
        select: 'title slug image', // Populate post details
      })
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit)
      .exec();

    // Construct the post URL for each comment
    comments.forEach(comment => {
      if (comment.postId && comment.postId.slug) {
        comment.postId.url = `/posts/${comment.postId.slug}`;
      }
    });

    // Get total comments count
    const totalComments = await Comment.countDocuments();
    
    // Get count of comments from the last month
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthComments = await Comment.countDocuments({ createdAt: { $gte: oneMonthAgo } });

    // Respond with comments and statistics
    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (error) {
    next(error); // Pass errors to error-handling middleware
  }
};