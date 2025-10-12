const User = require('../models/User');
const Community = require('../models/Community');
const Resource = require('../models/Resource');
const Discussion = require('../models/Discussion');

// List of inappropriate words (customize as needed)
const INAPPROPRIATE_WORDS = ['spam', 'abuse', 'hate', 'violence', 'rascal', 'donkey', 'fool', 'aryan', 'badResource','badDiscussion'];

// Delete inappropriate resource
exports.deleteResource = async (req, res) => {
  const { resourceId, reason } = req.body;
  try {
    if (!reason) throw new Error('Reason is required for deletion');

    const resource = await Resource.findById(resourceId);
    if (!resource) throw new Error('Resource not found');

    // Check if the resource contains inappropriate words
    const isInappropriate = INAPPROPRIATE_WORDS.some((word) =>
      resource.title.toLowerCase().includes(word) || 
      resource.tags.some((tag) => tag.toLowerCase().includes(word))
    );

    if (!isInappropriate) throw new Error('Resource does not contain inappropriate content');

    await resource.remove();
    res.status(200).json({ success: true, message: 'Resource deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Delete inappropriate discussion and ban the user
exports.deleteDiscussion = async (req, res) => {
    const { discussionId, reason } = req.body;
    try {
      if (!reason) throw new Error('Reason is required for deletion');
  
      const discussion = await Discussion.findById(discussionId);
      if (!discussion) throw new Error('Discussion not found');
  
      // Check if the discussion title contains inappropriate words
      const isInappropriate = INAPPROPRIATE_WORDS.some((word) =>
        discussion.title.toLowerCase().includes(word)
      );
  
      if (!isInappropriate) throw new Error('Discussion does not contain inappropriate content');
  
      // Delete the discussion
      // await discussion.remove();
  
      // Ban the user who created the discussion
      const user = await User.findById(discussion.author);
      if (!user) throw new Error('User not found');
  
      user.isBanned = true;
      await user.save();
      await Discussion.deleteOne({_id:discussionId});
      res.status(200).json({ success: true, message: 'Discussion deleted and user banned successfully' });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  };
  

// Ban a user
exports.banUser = async (req, res) => {
  const { userId, reason } = req.body;
  try {
    if (!reason) throw new Error('Reason is required for banning');

    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    user.isBanned = true;
    await user.save();

    res.status(200).json({ success: true, message: 'User banned successfully' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Create a new community (admin-only)
exports.createCommunity = async (req, res) => {
  const { name, description, isPublic } = req.body;
  try {
    const community = await Community.create({
      name,
      description,
      isPublic,
      createdBy: req.user.id,
      members: [req.user.id],
    });

    res.status(201).json({ success: true, data: community });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
