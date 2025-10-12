
const Notification = require('../models/Notifications')
const Discussion = require('../models/Discussion');
const Community = require('../models/Community');

// // Participate in Discussion
// exports.participateInDiscussion = async (req, res) => {
//   try {
//     const discussion = await Discussion.findById(req.params.discussionId);
//     if (!discussion) throw new Error('Discussion not found');
//     discussion.comments.push({ user: req.user.id, content });
//     await discussion.save();
//     res.status(200).json({ message: 'Comment added successfully' });
//   } catch (err) {
//     res.status(404).json({ error: 'Discussion not found' });
//   }
// };



// Create a new discussion
exports.createDiscussion = async (req, res) => {
  const { title, content, communityId } = req.body;
  try {
    const community = await Community.findById(communityId);
    if (!community) throw new Error('Community not found');

    const discussion = await Discussion.create({
      title,
      content,
      author: req.user.id,
      community: communityId,
    });

    community.discussions.push(discussion._id);
    await community.save();

    //creating notification for all members 
    const notificationMessage = `${req.user.username} started a new discussion: "${title}".`
    const notification = community.members.map((member)=>({
      userId:member,
      communityId: community._id,
      type:'discussion',
      message: notificationMessage
    }));

    await Notification.insertMany(notification);

    res.status(201).json({ success: true, data: discussion });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};


// Get all discussions from all communities
exports.getAllDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find()
      .populate('author', 'username') // Include author's username
      .populate('community', 'name'); // Include community name
    res.status(200).json({ success: true, data: discussions });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

//Get discussion
exports.getDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.discussionId)
    res.status(200).json({ success: true, data: discussion });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Get all discussions in a community
exports.getDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find({ community: req.params.communityId })
      .populate('author', 'username')
      .populate('comments.user', 'username');
    res.status(200).json({ success: true, data: discussions });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Add a comment to a discussion
exports.addComment = async (req, res) => {
  const { content } = req.body;
  try {
    const discussion = await Discussion.findById(req.params.discussionId);
    if (!discussion) throw new Error('Discussion not found');

    discussion.comments.push({ user: req.user.id, content });
    await discussion.save();

    res.status(200).json({ success: true, data: discussion });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Upvote a discussion
exports.upvoteDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.discussionId);
    if (!discussion) throw new Error('Discussion not found');

    discussion.upvotes += 1;
    await discussion.save();

    res.status(200).json({ success: true, data: discussion });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Downvote a discussion
exports.downvoteDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.discussionId);
    if (!discussion) throw new Error('Discussion not found');

    discussion.downvotes += 1;
    await discussion.save();

    res.status(200).json({ success: true, data: discussion });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
