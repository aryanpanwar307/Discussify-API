const Community = require('../models/Community');
const User = require('../models/User');
const Notification = require('../models/Notifications')
// Create a new community
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
    res.status(201).json({community :community ,  message:'Community created successfully' });
  } catch (err) {
    res.status(400).json({ message:'Invalid request body' });
  }
};

// uploading banner of the community
exports.uploadBanner = async (req, res) => {
  try {
    if (!req.file) throw new Error('No file uploaded');

    const community = await Community.findById(req.params.communityId);
    if (!community) throw new Error('Community not found');

    // Check if the user is the creator of the community
    if (community.createdBy.toString() !== req.user.id) {
      throw new Error('Not authorized to upload banner for this community');
    }

    // Update the community with the banner path
    community.banner = req.file.path;
    await community.save();

    res.status(200).json({ success: true, data: community });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};


// Get all communities
exports.getCommunities = async (req, res) => {
  try {
    const communities = await Community.find().populate('createdBy', 'username');
    res.status(200).json({ success: true, data: communities });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Get a specific community
exports.getCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.communityId)
      .populate('createdBy', 'username')
      .populate('members', 'username');
    if (!community) throw new Error('Community not found');
    res.status(200).json({ success: true, data: community });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Join a community
exports.joinCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.communityId);
    console.log(community,'myid');
    
    if (!community) throw new Error('Community not found');

    // Check if user is already a member
    if (community.members.includes(req.user.id)) {
        res.send(200).json({msg :"User already a member" , success :true} )
    }

    community.members.push(req.user.id);
    await community.save();

    // Add community to user's communities
    const user = await User.findById(req.user.id);
    user.communities.push(community._id);
    await user.save();

    //creating notification
    const notification = await Notification.create({
      userId: community.createdBy._id,
      communityId: community._id,
      type:'join',
      message: `${req.user.username} joined your community "${community.name}".`
    });

    res.status(200).json({ message:'Joined community successfully' });
  } catch (err) {
     throw err
    res.status(404).json({ message:'Community not found' , error:err });
  }
}; 

// Update community details
exports.updateCommunity = async (req, res) => {
  const { name, description, isPublic } = req.body;
  try {
    const community = await Community.findById(req.params.communityId);
    if (!community) throw new Error('Community not found');

    // Check if the user is the creator of the community
    if (community.createdBy.toString() !== req.user.id) {
      throw new Error('Not authorized to update this community');
    }

    // Update fields if provided
    if (name) community.name = name;
    if (description) community.description = description;
    if (isPublic !== undefined) community.isPublic = isPublic;

    await community.save();

    res.status(200).json({ success: true, data: community });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
